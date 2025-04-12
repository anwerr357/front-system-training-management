
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, AlertTriangle, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Define the training type
interface Training {
  id: number;
  title: string;
  year: number;
  duration: number;
  domainId: string;
  domainName?: string;
  budget: number;
  instructorId: string;
  instructorName?: string;
  status?: string;
  participants?: number;
}

const TrainingsPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 8,
    domainId: '',
    budget: 0,
    instructorId: ''
  });
  
  // State for the training being edited
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 8,
    domainId: '',
    budget: 0,
    instructorId: ''
  });

  // State to store all trainings
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: 1,
      title: "Web Development",
      year: 2025,
      duration: 8,
      domainId: "1",
      domainName: "Information Technology",
      budget: 5000,
      instructorId: "1",
      instructorName: "Dr. Robert Chen",
      status: "Active",
      participants: 24
    },
    {
      id: 2,
      title: "Data Science",
      year: 2025,
      duration: 12,
      domainId: "2",
      domainName: "Business Analytics",
      budget: 7500,
      instructorId: "2",
      instructorName: "Prof. Lisa Wong",
      status: "Upcoming",
      participants: 16
    },
    {
      id: 3,
      title: "UI/UX Design",
      year: 2025,
      duration: 6,
      domainId: "3",
      domainName: "Design",
      budget: 4500,
      instructorId: "3",
      instructorName: "Dr. Michael Taylor",
      status: "In Review",
      participants: 18
    }
  ]);

  // Sample data for instructors and domains
  const instructors = [
    { id: 1, name: 'Dr. Robert Chen', specialty: 'Web Development' },
    { id: 2, name: 'Prof. Lisa Wong', specialty: 'Data Science' },
    { id: 3, name: 'Dr. Michael Taylor', specialty: 'UI/UX Design' },
    { id: 4, name: 'Prof. Sarah Johnson', specialty: 'Mobile Development' }
  ];

  const domains = [
    { id: 1, name: 'Information Technology' },
    { id: 2, name: 'Business Analytics' },
    { id: 3, name: 'Design' },
    { id: 4, name: 'Project Management' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isEdit: boolean = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string, isEdit: boolean = false) => {
    if (isEdit) {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Function to start editing a training
  const startEditTraining = (training: Training) => {
    setEditingTraining(training);
    setEditFormData({
      title: training.title,
      year: training.year,
      duration: training.duration,
      domainId: training.domainId,
      budget: training.budget,
      instructorId: training.instructorId
    });
    setEditOpen(true);
  };

  // Function to handle updating a training
  const handleUpdateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTraining) return;
    
    // Find the domain and instructor names
    const domain = domains.find(d => d.id.toString() === editFormData.domainId);
    const instructor = instructors.find(i => i.id.toString() === editFormData.instructorId);
    
    // Create an updated training object
    const updatedTraining: Training = {
      ...editingTraining,
      title: editFormData.title,
      year: editFormData.year,
      duration: editFormData.duration,
      domainId: editFormData.domainId,
      domainName: domain?.name,
      budget: editFormData.budget,
      instructorId: editFormData.instructorId,
      instructorName: instructor?.name,
    };
    
    // Update the training in the state
    const updatedTrainings = trainings.map(training => 
      training.id === editingTraining.id ? updatedTraining : training
    );
    
    setTrainings(updatedTrainings);
    
    // Show success toast
    toast({
      title: "Training Updated",
      description: `${editFormData.title} has been updated successfully.`
    });
    
    // Close the dialog and reset the form
    setEditOpen(false);
    setEditingTraining(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the domain and instructor names
    const domain = domains.find(d => d.id.toString() === formData.domainId);
    const instructor = instructors.find(i => i.id.toString() === formData.instructorId);
    
    // Create a new training object
    const newTraining: Training = {
      id: trainings.length > 0 ? Math.max(...trainings.map(t => t.id)) + 1 : 1,
      title: formData.title,
      year: formData.year,
      duration: formData.duration,
      domainId: formData.domainId,
      domainName: domain?.name,
      budget: formData.budget,
      instructorId: formData.instructorId,
      instructorName: instructor?.name,
      status: "Upcoming",
      participants: 0
    };
    
    // Add the new training to the state
    setTrainings([...trainings, newTraining]);
    
    // Show success toast
    toast({
      title: "Training Created",
      description: `${formData.title} has been added successfully.`
    });
    
    // Reset the form and close the dialog
    setOpen(false);
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      duration: 8,
      domainId: '',
      budget: 0,
      instructorId: ''
    });
  };

  // Function to open delete confirmation dialog
  const confirmDeleteTraining = (id: number) => {
    setTrainingToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Function to handle deleting a training after confirmation
  const handleDeleteTraining = () => {
    if (trainingToDelete === null) return;
    
    // Filter out the training with the matching id
    const updatedTrainings = trainings.filter(training => training.id !== trainingToDelete);
    setTrainings(updatedTrainings);
    
    // Find the deleted training name for the toast message
    const deletedTraining = trainings.find(training => training.id === trainingToDelete);
    
    // Show success toast
    toast({
      title: "Training Deleted",
      description: `${deletedTraining?.title || 'The training'} has been removed successfully.`
    });
    
    // Close the dialog and reset the training to delete
    setDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trainings Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Training
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Training</DialogTitle>
              <DialogDescription>
                Create a new training program by filling out the form below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter training title" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    value={formData.year}
                    onChange={handleInputChange}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    value={formData.duration}
                    onChange={handleInputChange}
                    min={1}
                    max={52}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('domainId', value)}
                  value={formData.domainId}
                >
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id.toString()}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input 
                  id="budget" 
                  name="budget" 
                  type="number" 
                  value={formData.budget}
                  onChange={handleInputChange}
                  min={0}
                  step={100}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('instructorId', value)}
                  value={formData.instructorId}
                >
                  <SelectTrigger id="instructor">
                    <SelectValue placeholder="Select an instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map(instructor => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name} - {instructor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  Create Training
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Training Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
            <DialogDescription>
              Update the training information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTraining} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                name="title" 
                value={editFormData.title}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Enter training title" 
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year</Label>
                <Input 
                  id="edit-year" 
                  name="year" 
                  type="number" 
                  value={editFormData.year}
                  onChange={(e) => handleInputChange(e, true)}
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (weeks)</Label>
                <Input 
                  id="edit-duration" 
                  name="duration" 
                  type="number" 
                  value={editFormData.duration}
                  onChange={(e) => handleInputChange(e, true)}
                  min={1}
                  max={52}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-domain">Domain</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('domainId', value, true)}
                value={editFormData.domainId}
              >
                <SelectTrigger id="edit-domain">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map(domain => (
                    <SelectItem key={domain.id} value={domain.id.toString()}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-budget">Budget</Label>
              <Input 
                id="edit-budget" 
                name="budget" 
                type="number" 
                value={editFormData.budget}
                onChange={(e) => handleInputChange(e, true)}
                min={0}
                step={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Instructor</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('instructorId', value, true)}
                value={editFormData.instructorId}
              >
                <SelectTrigger id="edit-instructor">
                  <SelectValue placeholder="Select an instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id.toString()}>
                      {instructor.name} - {instructor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-admin text-white">
                Update Training
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this training? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTrainingToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTraining} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{training.title}</CardTitle>
              <CardDescription>{training.domainName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    training.status === 'Active' ? 'text-green-600' : 
                    training.status === 'Upcoming' ? 'text-blue-600' : 
                    'text-yellow-600'
                  }`}>{training.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Participants:</span>
                  <span className="font-medium">{training.participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{training.duration} weeks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="font-medium">{training.instructorName}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startEditTraining(training)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => confirmDeleteTraining(training.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingsPage;
