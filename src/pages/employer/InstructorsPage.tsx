
import React, { useState } from 'react';
import { Search, GraduationCap, Edit, Trash, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useInstructors, useInstructorActions, InstructorFormData } from '@/hooks/useInstructors';
import { useUsers } from '@/hooks/useUsers';
import { useEmployers } from '@/hooks/useEmployers';
import InstructorFormDialog from '@/components/instructors/InstructorFormDialog';
import { logActivity } from '@/utils/activityUtils';

const EmployerInstructorsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  // Fetch instructors using the GET http://localhost:8080/api/instructors endpoint
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();
  
  // Get instructor actions (create, update, delete)
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();
  
  // Get instructor userIds for filtering
  const instructorUserIds = instructors.map(instructor => instructor.id);
  
  // Fetch users for instructor form
  const { eligibleUsers, isLoading: isLoadingUsers } = useUsers(instructorUserIds, []);
  
  // Fetch employers for linking
  const { employers, isLoading: isLoadingEmployers } = useEmployers();

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    instructor => 
      (instructor.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInstructorSubmit = (data: InstructorFormData) => {
    if (selectedInstructor) {
      // Update existing instructor
      updateInstructor.mutate({
        id: selectedInstructor,
        data
      }, {
        onSuccess: () => {
          toast({
            title: "Instructor Updated",
            description: "The instructor has been updated successfully."
          });
          
          logActivity(
            'Instructor updated',
            `Instructor profile was updated by employer`,
            'update'
          );
          
          setIsFormOpen(false);
          setSelectedInstructor(null);
        }
      });
    } else {
      // Create new instructor
      createInstructor.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Instructor Added",
            description: "The new instructor has been added successfully."
          });
          
          logActivity(
            'Instructor added',
            `New instructor was added by employer`,
            'create'
          );
          
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleDeleteInstructor = () => {
    if (confirmDeleteId) {
      deleteInstructor.mutate(confirmDeleteId, {
        onSuccess: () => {
          toast({
            title: "Instructor Removed",
            description: "The instructor has been removed successfully."
          });
          
          logActivity(
            'Instructor removed',
            `Instructor was removed by employer`,
            'delete'
          );
          
          setConfirmDeleteId(null);
        }
      });
    }
  };
  
  // Loading state
  const isLoading = isLoadingInstructors || isLoadingUsers || isLoadingEmployers;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading instructors data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructors</h1>
        <Button 
          className="bg-employer text-white"
          onClick={() => {
            setSelectedInstructor(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={18} className="mr-2" />
          Add Instructor
        </Button>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search instructors..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Instructors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredInstructors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map(instructor => (
                  <TableRow key={instructor.id}>
                    <TableCell className="font-medium">{instructor.firstName}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.phone}</TableCell>
                    <TableCell>{instructor.type || 'General'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedInstructor(instructor.id);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setConfirmDeleteId(instructor.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No instructors found. Add one to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Instructor Form Dialog - Reusing from admin view */}
      <InstructorFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleInstructorSubmit}
        instructor={selectedInstructor ? instructors.find(i => i.id === selectedInstructor) || null : null}
        users={eligibleUsers}
        employers={employers.data || []}
        isLoading={isLoadingUsers || isLoadingEmployers}
        instructorUserIds={instructorUserIds}
      />
      
      {/* Confirmation Dialog for deleting instructor */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this instructor? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteInstructor}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerInstructorsPage;
