import React, { useState } from 'react';
import { Building2, Users, Edit, Trash, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Employer } from '@/types/employer';

interface EmployerListProps {
  employers: Employer[];
  onEdit: (employer: Employer) => void;
  onDelete: (id: number, name: string) => void;
  onViewDetails: (id: number) => void;
}

const EmployerList: React.FC<EmployerListProps> = ({ 
  employers, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState<Employer | null>(null);

  const openDeleteDialog = (employer: Employer) => {
    setEmployerToDelete(employer);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setEmployerToDelete(null);
    setDeleteDialogOpen(false);
  };

  if (employers.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No employers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employers.map(employer => (
        <Card key={employer.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{employer.employerName}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(employer.id)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(employer)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => openDeleteDialog(employer)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Employer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {employerToDelete?.employerName}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={closeDeleteDialog}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (employerToDelete) {
                            onDelete(employerToDelete.id, employerToDelete.employerName);
                            closeDeleteDialog();
                          }
                        }}
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
  );
};

export default EmployerList;
