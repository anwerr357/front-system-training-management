
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, Search, Plus, Edit, Trash, Eye, UserPlus } from 'lucide-react';
import { useEmployers } from '@/hooks/useEmployers';
import { useUsers } from '@/hooks/useUsers';
import EmployerFormDialog from '@/components/employers/EmployerFormDialog';
import EmployerDetailsDialog from '@/components/employers/EmployerDetailsDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Employer } from '@/types/employer';
import { logActivity } from '@/utils/activityUtils';

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

  const { 
    eligibleUsers,
    isLoading: isLoadingUsers
  } = useUsers(assignedUserIds);

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

  const handleSubmit = (formData: { employerName: string; userId?: string | number | undefined }) => {
    // Ensure userId is a number or undefined, not a string
    const data = {
      employerName: formData.employerName,
      userId: typeof formData.userId === 'string' && formData.userId 
        ? parseInt(formData.userId) 
        : formData.userId
    };

    if (selectedEmployer) {
      // Update existing employer
      updateEmployer.mutate({ 
        id: selectedEmployer.id, 
        data
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
      createEmployer.mutate(data, {
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employer Management</h1>
        <Button className="bg-admin text-white" onClick={handleOpenAddDialog}>
          <Plus size={18} className="mr-2" />
          Add Employer
        </Button>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search employers..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <p>Loading employers...</p>
        </div>
      ) : employers.error ? (
        <div className="text-center py-10 text-red-500">
          <p>Error loading employers. Please try again later.</p>
        </div>
      ) : (
        <>
          {filteredEmployers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No employers found. {searchTerm ? 'Try a different search term.' : 'Add your first employer!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployers.map(employer => (
                <Card key={employer.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{employer.employerName}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDetailsDialog(employer.id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(employer)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Employer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {employer.employerName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(employer.id, employer.employerName)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="flex items-center text-sm mb-2">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.userId ? 'Has assigned representative' : 'No user representative'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Employer Form Dialog */}
      <EmployerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleSubmit}
        employer={selectedEmployer}
        eligibleUsers={eligibleUsers}
        isLoading={isLoadingUsers || createEmployer.isPending || updateEmployer.isPending}
      />

      {/* Employer Details Dialog */}
      <EmployerDetailsDialog
        employerId={selectedEmployerId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
};

export default EmployersPage;
