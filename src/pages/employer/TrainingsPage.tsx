
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Mail, Phone, Calendar, Edit, Trash, MoreVertical, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';

interface Instructor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: string;
  image: string;
  userId?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const EmployerTrainingsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  
  const [instructors, setInstructors] = useState<Instructor[]>([
    { 
      id: 1, 
      name: 'Dr. Robert Chen', 
      specialty: 'Web Development', 
      email: 'dr.chen@example.com',
      phone: '+1 (555) 123-4567',
      availability: 'Mon-Wed',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      userId: 1
    },
    { 
      id: 2, 
      name: 'Prof. Lisa Wong', 
      specialty: 'Data Science', 
      email: 'lwong@example.com',
      phone: '+1 (555) 987-6543',
      availability: 'Tue-Fri',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      userId: 2
    },
    { 
      id: 3, 
      name: 'Dr. Michael Taylor', 
      specialty: 'UI/UX Design', 
      email: 'mtaylor@example.com',
      phone: '+1 (555) 456-7890',
      availability: 'Wed-Sat',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      userId: 3
    },
    { 
      id: 4, 
      name: 'Prof. Sarah Johnson', 
      specialty: 'Mobile Development', 
      email: 'sjohnson@example.com',
      phone: '+1 (555) 234-5678',
      availability: 'Mon-Thu',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      userId: 4
    },
  ]);

  // Available users that can become instructors
  const users: User[] = [
    { id: 1, name: 'Dr. Robert Chen', email: 'dr.chen@example.com', role: 'Instructor' },
    { id: 2, name: 'Prof. Lisa Wong', email: 'lwong@example.com', role: 'Instructor' },
    { id: 3, name: 'Dr. Michael Taylor', email: 'mtaylor@example.com', role: 'Instructor' },
    { id: 4, name: 'Prof. Sarah Johnson', email: 'sjohnson@example.com', role: 'Instructor' },
    { id: 5, name: 'Dr. James Wilson', email: 'jwilson@example.com', role: 'Instructor' },
    { id: 6, name: 'Prof. Emily Davis', email: 'edavis@example.com', role: 'Instructor' },
    { id: 7, name: 'Dr. David Lee', email: 'dlee@example.com', role: 'Instructor' },
    { id: 8, name: 'Prof. Maria Garcia', email: 'mgarcia@example.com', role: 'Instructor' },
  ];

  const specialties = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Mobile Development',
    'Cloud Computing',
    'Machine Learning',
    'DevOps',
    'Cybersecurity'
  ];

  const availabilityOptions = [
    'Mon-Wed',
    'Tue-Fri',
    'Wed-Sat',
    'Mon-Thu',
    'Thu-Sat',
    'Weekends Only',
    'Full Week'
  ];

  const [formData, setFormData] = useState({
    userId: '',
    specialty: '',
    phone: '',
    availability: ''
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      userId: '',
      specialty: '',
      phone: '',
      availability: ''
    });
    setEditMode(false);
    setOpen(true);
  };

  const openEditDialog = (instructor: Instructor) => {
    setCurrentInstructor(instructor);
    setFormData({
      userId: instructor.userId?.toString() || '',
      specialty: instructor.specialty,
      phone: instructor.phone,
      availability: instructor.availability
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const instructorToDelete = instructors.find(i => i.id === id);
    
    if (instructorToDelete) {
      setInstructors(instructors.filter(instructor => instructor.id !== id));
      
      toast({
        title: "Instructor Removed",
        description: `${instructorToDelete.name} has been removed from instructors.`
      });
      
      logActivity(
        'Instructor removed',
        `${instructorToDelete.name} was removed from the instructors list`,
        'delete'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected user
    const selectedUser = users.find(user => user.id.toString() === formData.userId);
    
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a valid user.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.specialty || !formData.phone || !formData.availability) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && currentInstructor) {
      // Update existing instructor
      const updatedInstructors = instructors.map(instructor => 
        instructor.id === currentInstructor.id
          ? {
              ...instructor,
              name: selectedUser.name,
              email: selectedUser.email,
              specialty: formData.specialty,
              phone: formData.phone,
              availability: formData.availability,
              userId: selectedUser.id
            }
          : instructor
      );
      
      setInstructors(updatedInstructors);
      
      toast({
        title: "Instructor Updated",
        description: `${selectedUser.name}'s information has been updated.`
      });
      
      logActivity(
        'Instructor updated',
        `${selectedUser.name}'s instructor profile was updated`,
        'update'
      );
    } else {
      // Check if instructor already exists
      const instructorExists = instructors.some(
        instructor => instructor.email === selectedUser.email
      );
      
      if (instructorExists) {
        toast({
          title: "Instructor Exists",
          description: `${selectedUser.name} is already registered as an instructor.`,
          variant: "destructive"
        });
        return;
      }
      
      // Create new instructor
      const newInstructor: Instructor = {
        id: instructors.length > 0 ? Math.max(...instructors.map(i => i.id)) + 1 : 1,
        name: selectedUser.name,
        email: selectedUser.email,
        specialty: formData.specialty,
        phone: formData.phone,
        availability: formData.availability,
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`,
        userId: selectedUser.id
      };
      
      setInstructors([...instructors, newInstructor]);
      
      toast({
        title: "Instructor Added",
        description: `${selectedUser.name} has been added as an instructor.`
      });
      
      logActivity(
        'Instructor added',
        `${selectedUser.name} was added as a new instructor`,
        'create'
      );
    }
    
    // Reset form and close dialog
    setFormData({
      userId: '',
      specialty: '',
      phone: '',
      availability: ''
    });
    setCurrentInstructor(null);
    setOpen(false);
  };

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    instructor => 
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewType('grid')} className={viewType === 'grid' ? 'bg-gray-100' : ''}>
            Grid View
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewType('table')} className={viewType === 'table' ? 'bg-gray-100' : ''}>
            Table View
          </Button>
          <Button className="bg-employer text-white" onClick={openAddDialog}>
            <PlusCircle size={18} className="mr-2" />
            Add Instructor
          </Button>
        </div>
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
      
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center relative">
                <img 
                  src={instructor.image} 
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={instructor.image} 
                          alt={instructor.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span>{instructor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{instructor.specialty}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.phone}</TableCell>
                    <TableCell>{instructor.availability}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(instructor)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(instructor.id)} className="text-red-600">
                        <Trash size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
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
              <Label htmlFor="user">Select User</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('userId', value)}
                value={formData.userId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('specialty', value)}
                value={formData.specialty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="availability">Availability</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('availability', value)}
                value={formData.availability}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-employer text-white">
                {editMode ? 'Update Instructor' : 'Add Instructor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerTrainingsPage;
