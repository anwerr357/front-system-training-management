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
  
  // Fetch instructors using the GET http://localhost:8080/api/instructors endpoint
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();
  
  // Get instructor actions (create, update, delete)
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();
  
  // Get instructor userIds for filtering
  const instructorUserIds = instructors.map(instructor => instructor.userId);
  
  // Fetch participants for additional filtering
  const { data: participants = [], isLoading: isLoadingParticipants } = useParticipants(instructorUserIds);
  const participantUserIds = participants.map(participant => participant.userId);
  
  // Fetch users with filtering for both instructors and participants
  const { eligibleUsers, users, isLoading: isLoadingUsers } = useUsers(instructorUserIds, participantUserIds);
  
  // Fetch employers for linking
  const { employers, isLoading: isLoadingEmployers } = useEmployers();

  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    type: '',
    email: '',
    phone: '',
    employerId: ''
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If userId is changed, auto-fill firstName, lastName, and email from the selected user
    if (name === 'userId') {
      const selectedUser = eligibleUsers.find(user => user.id.toString() === value);
      if (selectedUser) {
        const nameParts = selectedUser.name.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: selectedUser.email,
          [name]: value
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      type: '',
      email: '',
      phone: '',
      employerId: ''
    });
    setEditMode(false);
    setOpen(true);
  };

  const openEditDialog = (instructor: Instructor) => {
    setCurrentInstructor(instructor);
    const nameParts = instructor.name?.split(' ') || ['', ''];
    setFormData({
      userId: instructor.userId?.toString() || '',
      firstName: instructor.firstName || nameParts[0] || '',
      lastName: instructor.lastName || nameParts.slice(1).join(' ') || '',
      type: instructor.type || '',
      email: instructor.email || '',
      phone: instructor.phone || '',
      employerId: instructor.employerId?.toString() || ''
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const instructorToDelete = instructors.find(i => i.id === id);
    
    if (instructorToDelete) {
      // Delete instructor using DELETE http://localhost:8080/api/instructors/:id
      deleteInstructor.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Instructor Removed",
            description: `${instructorToDelete.name} has been removed.`
          });
          
          logActivity(
            'Instructor removed',
            `${instructorToDelete.name} was removed from the instructor list`,
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected user from the filtered user list
    const selectedUser = users.data?.find(user => user.id.toString() === formData.userId);
    
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a valid user.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare instructor data
    const instructorData: InstructorFormData = {
      userId: parseInt(formData.userId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      type: formData.type || "Full-Time",
      email: formData.email,
      phone: formData.phone,
      employerId: formData.employerId && formData.employerId !== "" ? parseInt(formData.employerId) : undefined
    };
    
    if (editMode && currentInstructor) {
      // Update existing instructor using PUT http://localhost:8080/api/instructors/:id
      updateInstructor.mutate({ 
        id: currentInstructor.id, 
        data: instructorData
      }, {
        onSuccess: () => {
          toast({
            title: "Instructor Updated",
            description: `${selectedUser.name}'s information has been updated.`
          });
          
          logActivity(
            'Instructor updated',
            `${selectedUser.name}'s instructor profile was updated`,
            'update'
          );
          
          setOpen(false);
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
      // Check if instructor already exists
      const instructorExists = instructors.some(
        instructor => instructor.userId === parseInt(formData.userId)
      );
      
      if (instructorExists) {
        toast({
          title: "Instructor Exists",
          description: `${selectedUser.name} is already registered as an instructor.`,
          variant: "destructive"
        });
        return;
      }
      
      // Create new instructor using POST http://localhost:8080/api/instructors
      createInstructor.mutate(instructorData, {
        onSuccess: () => {
          toast({
            title: "Instructor Added",
            description: `${selectedUser.name} has been added as an instructor.`
          });
          
          logActivity(
            'Instructor added',
            `${selectedUser.name} was added as a new instructor`,
            'create'
          );
          
          setOpen(false);
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

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    instructor => 
      (instructor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const isLoading = isLoadingInstructors || isLoadingParticipants || isLoadingEmployers;

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
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center relative">
                <img 
                  src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`}
                  alt={instructor.name}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-white/20 text-white hover:bg-white/30">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(instructor)}>
                        <Edit size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(instructor.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-center">{instructor.name}</CardTitle>
                <p className="text-center text-sm text-gray-500">{instructor.specialty}</p>
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
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Available: {instructor.availability}</span>
                </div>
                {instructor.employerId && (
                  <div className="flex items-center text-sm">
                    <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Employer ID: {instructor.employerId}</span>
                  </div>
                )}
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
                : 'Select a user and fill in the instructor details.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Select User</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('userId', value)}
                value={formData.userId}
                disabled={editMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleUsers.length === 0 ? (
                    <SelectItem value="no-users" disabled>
                      No eligible users available
                    </SelectItem>
                  ) : (
                    eligibleUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="employerId">Employer (Optional)</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('employerId', value)}
                value={formData.employerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {employers.data && employers.data.map((employer) => (
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
    </div>
  );
};

export default InstructorsPage;
