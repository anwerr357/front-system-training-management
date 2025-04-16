
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useInstructors, useInstructorActions, InstructorFormData, Instructor } from '@/hooks/useInstructors';
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

  // Fetch instructors using the GET /instructors endpoint
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();
  
  // Get instructor actions (create, update, delete)
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();
  
  // Get instructor IDs for filtering participants
  const instructorUserIds = instructors.map(instructor => instructor.userId);
  
  // Fetch participants using GET /participants endpoint
  const { data: participants = [], isLoading: isLoadingParticipants } = useParticipants(instructorUserIds);
  
  // Filter out participants who are already instructors
  const eligibleParticipants = participants.filter(
    participant => !instructorUserIds.includes(participant.userId)
  );
  
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
    setSelectedInstructorId(instructorId);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = (formData: InstructorFormData) => {
    if (selectedInstructor) {
      // Update existing instructor using PUT /instructors/:id
      updateInstructor.mutate({ 
        id: selectedInstructor.id, 
        data: formData
      }, {
        onSuccess: () => {
          const participant = participants.find(p => p.userId === formData.userId);
          logActivity(
            'Instructor updated',
            `${participant?.name || 'Instructor'} was updated`,
            'update'
          );
          toast({
            title: "Instructor Updated",
            description: `${participant?.name || 'Instructor'} has been updated successfully.`
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
      // Create new instructor using POST /instructors
      createInstructor.mutate(formData, {
        onSuccess: () => {
          const participant = participants.find(p => p.userId === formData.userId);
          logActivity(
            'Instructor added',
            `${participant?.name || 'Participant'} was added as a new instructor`,
            'create'
          );
          toast({
            title: "Instructor Added",
            description: `${participant?.name || 'Participant'} has been added as an instructor.`
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
    // Delete instructor using DELETE /instructors/:id
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
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = isLoadingInstructors || isLoadingParticipants || isLoadingEmployers;

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
        participants={eligibleParticipants}
        employers={employers.data || []}
        isLoading={isLoading || createInstructor.isPending || updateInstructor.isPending}
      />

      <InstructorDetailsDialog
        instructorId={selectedInstructorId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
};

export default InstructorManagementPage;
