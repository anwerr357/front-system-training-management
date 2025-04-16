
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useEmployers } from '@/hooks/useEmployers';
import { useUsers } from '@/hooks/useUsers';
import { Employer, EmployerFormData } from '@/types/employer';
import { logActivity } from '@/utils/activityUtils';
import EmployerHeader from '@/components/employers/EmployerHeader';
import EmployerSearch from '@/components/employers/EmployerSearch';
import EmployerList from '@/components/employers/EmployerList';
import EmployerFormDialog from '@/components/employers/EmployerFormDialog';
import EmployerDetailsDialog from '@/components/employers/EmployerDetailsDialog';

const EmployersPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [selectedEmployerId, setSelectedEmployerId] = useState<number | null>(null);

  const { 
    employers, 
    createEmployer, 
    updateEmployer, 
    deleteEmployer,
    isLoading 
  } = useEmployers();

  // Get the user IDs that are already assigned to employers
  const assignedUserIds = employers.data?.filter(emp => emp.userId).map(emp => emp.userId) as number[] || [];
  const { eligibleUsers, isLoading: isLoadingUsers } = useUsers(assignedUserIds);

  const handleOpenAddDialog = () => {
    setSelectedEmployer(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (employer: Employer) => {
    setSelectedEmployer(employer);
    setFormDialogOpen(true);
  };

  const handleOpenDetailsDialog = (employerId: number) => {
    setSelectedEmployerId(employerId);
    setDetailsDialogOpen(true);
  };

  const handleSubmit = (formData: EmployerFormData) => {
    if (selectedEmployer) {
      // Update existing employer
      updateEmployer.mutate({ 
        id: selectedEmployer.id, 
        data: formData
      }, {
        onSuccess: () => {
          logActivity(
            'Employer updated',
            `${formData.employerName} was updated`,
            'update'
          );
          setFormDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update employer. Please try again.",
            variant: "destructive"
          });
        }
      });
    } else {
      // Create new employer
      createEmployer.mutate(formData, {
        onSuccess: () => {
          logActivity(
            'Employer added',
            `${formData.employerName} was added as a new employer`,
            'create'
          );
          setFormDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create employer. Please try again.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleDelete = (id: number, employerName: string) => {
    deleteEmployer.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Employer Removed",
          description: `${employerName} has been removed.`
        });
        
        logActivity(
          'Employer removed',
          `${employerName} was removed from the employer list`,
          'delete'
        );
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove employer. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Filter employers based on search term
  const filteredEmployers = employers.data?.filter(employer => 
    employer.employerName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading employers...</p>
      </div>
    );
  }

  if (employers.error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error loading employers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <EmployerHeader onAddEmployer={handleOpenAddDialog} />
      <EmployerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <EmployerList 
        employers={filteredEmployers}
        onEdit={handleOpenEditDialog}
        onDelete={handleDelete}
        onViewDetails={handleOpenDetailsDialog}
      />

      <EmployerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleSubmit}
        employer={selectedEmployer}
        eligibleUsers={eligibleUsers}
        isLoading={isLoadingUsers || createEmployer.isPending || updateEmployer.isPending}
      />

      <EmployerDetailsDialog
        employerId={selectedEmployerId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
};

export default EmployersPage;
