import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Mail, Phone, Calendar, Edit, Trash, MoreVertical, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';
import { useInstructors, useInstructorActions, InstructorFormData, Instructor } from '@/hooks/useInstructors';
import { useParticipants } from '@/hooks/useParticipants';
import { useEmployers } from '@/hooks/useEmployers';
import { useUsers } from '@/hooks/useUsers';

const InstructorsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);

  // Fetch instructors using the GET http://localhost:8080/api/instructors endpoint
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();

  // Get instructor actions (create, update, delete)
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();

  // Fetch employers for linking
  const { employers, isLoading: isLoadingEmployers } = useEmployers();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '', // Added password field
    type: 'Full-Time', // Default type
    employerId: '',
    role: 'instructor', // Default role
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '', // Reset password field
      type: 'Full-Time',
      employerId: '',
      role: 'instructor',
    });
    setEditMode(false);
    setOpen(true);
  };

  const openEditDialog = (instructor: Instructor) => {
    setCurrentInstructor(instructor);
    setFormData({
      firstName: instructor.firstName || '',
      lastName: instructor.lastName || '',
      email: instructor.email || '',
      phone: instructor.phone || '',
      password: '', // Do not prefill password for security reasons
      type: instructor.type || 'Full-Time',
      employerId: instructor.employerId?.toString() || '',
      role: 'instructor', // Default role
    });
    setEditMode(true);
    setOpen(true);
  };

  const openDeleteDialog = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (instructorToDelete) {
      deleteInstructor.mutate(instructorToDelete.id, {
        onSuccess: () => {
          toast({
            title: 'Instructor Removed',
            description: `${instructorToDelete.firstName} ${instructorToDelete.lastName} has been removed.`,
          });
          setDeleteDialogOpen(false);
          setInstructorToDelete(null);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to remove instructor. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const instructorData: InstructorFormData = {
      firstName: formData.firstName || currentInstructor?.firstName,
      lastName: formData.lastName || currentInstructor?.lastName,
      email: formData.email || currentInstructor?.email,
      phone: formData.phone || currentInstructor?.phone,
      password: formData.password || currentInstructor?.password, // Include password in the payload
      type: formData.type || currentInstructor?.type,
      employerId: formData.employerId ? parseInt(formData.employerId, 10) : currentInstructor?.employerId,
      role: 'instructor', // Default role
    };

    if (editMode && currentInstructor) {
      updateInstructor.mutate(
        {
          id: currentInstructor.id,
          data: instructorData,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Instructor Updated',
              description: `${formData.firstName} ${formData.lastName}'s information has been updated.`,
            });
            setOpen(false);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to update instructor. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createInstructor.mutate(instructorData, {
        onSuccess: () => {
          toast({
            title: 'Instructor Added',
            description: `${formData.firstName} ${formData.lastName} has been added as an instructor.`,
          });
          setOpen(false);
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to create instructor. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const filteredInstructors = instructors.filter(
    (instructor) =>
      (instructor.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const isLoading = isLoadingInstructors || isLoadingEmployers;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading instructors...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructors</h1>
        <Button className="bg-admin text-white" onClick={openAddDialog}>
          <GraduationCap size={18} className="mr-2" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">{`${instructor.firstName} ${instructor.lastName}`}</CardTitle>
                <p className="text-center text-sm text-gray-500">{instructor.type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{instructor.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{instructor.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(instructor)}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(instructor)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No instructors found. Add one to get started.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
            <DialogDescription>
              {editMode
                ? 'Update the instructor information below.'
                : 'Fill in the instructor details below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) => handleSelectChange('type', value)}
                value={formData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employerId">Employer (Optional)</Label>
              <Select
                onValueChange={(value) => handleSelectChange('employerId', value === "none" ? "" : value)}
                value={formData.employerId || "none"} // Default to "none" if no employer is selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {employers.data &&
                    employers.data.map((employer) => (
                      <SelectItem key={employer.id} value={employer.id.toString()}>
                        {employer.employerName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-admin text-white">
                {editMode ? 'Update Instructor' : 'Add Instructor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {instructorToDelete?.firstName} {instructorToDelete?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsPage;
