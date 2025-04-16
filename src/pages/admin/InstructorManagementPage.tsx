
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useInstructors, useInstructorActions, InstructorFormData, Instructor } from '@/hooks/useInstructors';
import { useUsers } from '@/hooks/useUsers';
import { useParticipants } from '@/hooks/useParticipants';
import { useEmployers } from '@/hooks/useEmployers';
import { logActivity } from '@/utils/activityUtils';
import InstructorHeader from '@/components/instructors/InstructorHeader';
import InstructorSearch from '@/components/instructors/InstructorSearch';
import InstructorList from '@/components/instructors/InstructorList';
import InstructorFormDialog from '@/components/instructors/InstructorFormDialog';
import InstructorDetailsDialog from '@/components/instructors/InstructorDetailsDialog';

const InstructorManagementPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);

  // Fetch instructors using the GET http://localhost:8080/api/instructors endpoint
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();
  
  // Get instructor actions (create, update, delete)
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();
  
  // Get instructor IDs for filtering users
  const instructorUserIds = instructors.map(instructor => instructor.userId);

  // Fetch participants to filter them from eligible users
  const { data: participants = [], isLoading: isLoadingParticipants } = useParticipants();
  const participantUserIds = participants.map(participant => participant.userId);
  
  // Fetch users with both instructor and participant filtering
  const { eligibleUsers, isLoading: isLoadingUsers } = useUsers(instructorUserIds, participantUserIds);
  
  // Fetch employers for linking
  const { employers, isLoading: isLoadingEmployers } = useEmployers();

  const handleOpenAddDialog = () => {
    setSelectedInstructor(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setFormDialogOpen(true);
  };

  const handleOpenDetailsDialog = (instructorId: number) => {
    // This will trigger GET http://localhost:8080/api/instructors/:id and 
    // GET http://localhost:8080/api/instructors/:instructorId/trainings in the details dialog
    setSelectedInstructorId(instructorId);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = (formData: InstructorFormData) => {
    if (selectedInstructor) {
      // Update existing instructor using PUT http://localhost:8080/api/instructors/:id
      updateInstructor.mutate({ 
        id: selectedInstructor.id, 
        data: formData
      }, {
        onSuccess: () => {
          const user = eligibleUsers.find(u => u.id === formData.userId);
          logActivity(
            'Instructor updated',
            `${user?.name || 'Instructor'} was updated`,
            'update'
          );
          toast({
            title: "Instructor Updated",
            description: `${user?.name || 'Instructor'} has been updated successfully.`
          });
          setFormDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update instructor. Please try again.",
            variant: "destructive"
          });
        }
      });
    } else {
      // Create new instructor using POST http://localhost:8080/api/instructors
      createInstructor.mutate(formData, {
        onSuccess: () => {
          const user = eligibleUsers.find(u => u.id === formData.userId);
          logActivity(
            'Instructor added',
            `${user?.name || 'User'} was added as a new instructor`,
            'create'
          );
          toast({
            title: "Instructor Added",
            description: `${user?.name || 'User'} has been added as an instructor.`
          });
          setFormDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create instructor. Please try again.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleDelete = (id: number, instructorName: string) => {
    // Delete instructor using DELETE http://localhost:8080/api/instructors/:id
    deleteInstructor.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Instructor Removed",
          description: `${instructorName} has been removed.`
        });
        logActivity(
          'Instructor removed',
          `${instructorName} was removed from the instructor list`,
          'delete'
        );
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove instructor. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(instructor => 
    (instructor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (instructor.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (instructor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const isLoading = isLoadingInstructors || isLoadingUsers || isLoadingEmployers || isLoadingParticipants;

  if (isLoadingInstructors) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading instructors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <InstructorHeader onAddInstructor={handleOpenAddDialog} />
      <InstructorSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <InstructorList 
        instructors={filteredInstructors}
        onEdit={handleOpenEditDialog}
        onDelete={handleDelete}
        onViewDetails={handleOpenDetailsDialog}
      />

      <InstructorFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleSubmit}
        instructor={selectedInstructor}
        users={eligibleUsers}
        employers={employers.data || []}
        isLoading={isLoading || createInstructor.isPending || updateInstructor.isPending}
        instructorUserIds={instructorUserIds}
      />

      {/* This component uses GET /instructors/:id and GET /instructors/:instructorId/trainings */}
      <InstructorDetailsDialog
        instructorId={selectedInstructorId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
};

export default InstructorManagementPage;
