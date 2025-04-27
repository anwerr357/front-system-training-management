
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, AlertTriangle, Edit, Calendar, CalendarDays, XCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';

interface Training {
  id: number;
  title: string;
  year: number;
  duration: number;
  domainId: number;
  domainName?: string;
  budget: number;
  instructorId: number;
  instructorName?: string;
  status?: string;
  participants?: number;
  startTime?: string;
  endDate?: string;
  scheduledDays?: string[];
}
interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  type: string;
  employerId: number;
  userId: number;
}

interface Domain {
  id: number;
  title: string;
}

interface InstructorSchedule {
  instructorId: number;
  trainings: {
    id: number;
    title: string;
    startTime: string;
    endDate: string;
    scheduledDays: string[];
  }[];
}

const TrainingsPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 8,
    domainId: '',
    budget: 0,
    instructorId: '',
    startDate: '',
    scheduledDays: [] as string[]
  });
  
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 8,
    domainId: '',
    budget: 0,
    instructorId: '',
    startDate: '',
    scheduledDays: [] as string[]
  });
  
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [scheduleConflicts, setScheduleConflicts] = useState<{
    conflictingDates: string[];
    trainingTitle: string;
  } | null>(null);

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [domains, setDomains] = useState([]);
  const [instructorSchedules, setInstructorSchedules] = useState<InstructorSchedule[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const trainingsResponse = await axios.get('http://localhost:8080/api/trainings');
        const trainingsData = trainingsResponse.data;

        const instructorsResponse = await axios.get('http://localhost:8080/api/instructors');
        const instructorsData = instructorsResponse.data;
        setInstructors(instructorsData);

        const domainsResponse = await axios.get('http://localhost:8080/api/domains');
        const domainsData = domainsResponse.data;
        setDomains(domainsData);

        const processedTrainings = trainingsData.map((training: Training) => {
          const domain = domainsData.find((d: Domain) => d.id === training.domainId);
          const instructor = instructorsData.find((i: Instructor) => i.id === training.instructorId);
          return {
            ...training,
            domainName: domain?.title ?? 'Unknown Domain',
            instructorName: instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown Instructor',
            status: training.status ?? 'Upcoming',
            participants: training.participants ?? 0,
            startDate: training.startTime ?? '',
            endDate: training.endDate ?? '',
            scheduledDays: training.scheduledDays ?? []
          };
        });

        setTrainings(processedTrainings);

        const initialSchedules = instructorsData.map((instructor: Instructor) => {
          const instructorTrainings = processedTrainings
            .filter((t: Training) => t.instructorId === instructor.id && t?.startTime && t?.scheduledDays)
            .map((t: Training) => ({
              id: t.id,
              title: t.title,
              startDate: t.startTime || '',
              endDate: t.endDate || '',
              scheduledDays: t.scheduledDays || []
            }));

          return {
            instructorId: instructor.id,
            trainings: instructorTrainings
          };
        });

        setInstructorSchedules(initialSchedules);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
  
  const handleScheduleDaysChange = (day: string, isEdit: boolean = false) => {
    if (isEdit) {
      if (editFormData.scheduledDays.includes(day)) {
        setEditFormData(prev => ({
          ...prev,
          scheduledDays: prev.scheduledDays.filter(d => d !== day)
        }));
      } else {
        setEditFormData(prev => ({
          ...prev,
          scheduledDays: [...prev.scheduledDays, day]
        }));
      }
    } else {
      if (formData.scheduledDays.includes(day)) {
        setFormData(prev => ({
          ...prev,
          scheduledDays: prev.scheduledDays.filter(d => d !== day)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          scheduledDays: [...prev.scheduledDays, day]
        }));
      }
    }
  };

  const checkScheduleConflicts = (instructorId: string, scheduledDays: string[]): { hasConflicts: boolean, conflictingDates: string[], trainingTitle: string } => {
    const instructorIdNumber = parseInt(instructorId, 10);
    
    const instructorSchedule = instructorSchedules.find(schedule => schedule.instructorId === instructorIdNumber);
    
    if (!instructorSchedule) {
      return { hasConflicts: false, conflictingDates: [], trainingTitle: '' };
    }
    
    let conflictingDates: string[] = [];
    let conflictingTrainingTitle = '';
    
    for (const training of instructorSchedule.trainings) {
      if (editingTraining && training.id === editingTraining.id) {
        continue;
      }
      
      const conflicts = scheduledDays.filter(day => 
        training.scheduledDays.includes(day)
      );
      
      if (conflicts.length > 0) {
        conflictingDates = conflicts;
        conflictingTrainingTitle = training.title;
        break;
      }
    }
    
    return { 
      hasConflicts: conflictingDates.length > 0, 
      conflictingDates,
      trainingTitle: conflictingTrainingTitle
    };
  };

  const startEditTraining = (training: Training) => {
    setEditingTraining(training);
    setEditFormData({
      title: training.title,
      year: training.year,
      duration: training.duration,
      domainId: training.domainId.toString(),
      budget: training.budget,
      instructorId: training.instructorId.toString(),
      startDate: training.startTime || '',
      scheduledDays: training.scheduledDays || []
    });
    setEditOpen(true);
  };

  const handleUpdateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTraining) return;
    
    const { hasConflicts, conflictingDates, trainingTitle } = checkScheduleConflicts(
      editFormData.instructorId,
      editFormData.scheduledDays
    );
    
    if (hasConflicts) {
      setScheduleConflicts({
        conflictingDates,
        trainingTitle
      });
      setConflictDialogOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatePayload = {
        title: editFormData.title,
        year: parseInt(editFormData.year.toString(), 10),
        duration: parseInt(editFormData.duration.toString(), 10),
        budget: parseInt(editFormData.budget.toString(), 10),
        domainId: parseInt(editFormData.domainId, 10),
        instructorId: parseInt(editFormData.instructorId, 10)
      };
      
      await axios.put(`http://localhost:8080/api/trainings/${editingTraining.id}`, updatePayload);

      const foundDomain = domains.find(d => d.id.toString() === editFormData.domainId);
      const foundInstructor = instructors.find(i => i.id.toString() === editFormData.instructorId);
      
      const startDate = new Date(editFormData.startDate);
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(startDate.getDate() + parseInt(editFormData.duration.toString(), 10) - 1);
      
      const updatedTraining = {
        ...editingTraining,
        title: editFormData.title,
        year: parseInt(editFormData.year.toString(), 10),
        duration: parseInt(editFormData.duration.toString(), 10),
        domainId: parseInt(editFormData.domainId, 10),
        domainName: foundDomain?.title,
        budget: parseInt(editFormData.budget.toString(), 10),
        instructorId: parseInt(editFormData.instructorId, 10),
        instructorName: foundInstructor ? `${foundInstructor.firstName} ${foundInstructor.lastName}` : 'Unknown Instructor',
        startDate: editFormData.startDate,
        endDate: calculatedEndDate.toISOString().split('T')[0],
        scheduledDays: editFormData.scheduledDays
      };
      
      const updatedTrainings = trainings.map(training => 
        training.id === editingTraining.id ? updatedTraining : training
      );
      
      setTrainings(updatedTrainings);
      
      updateInstructorSchedule(updatedTraining, true);
      
      logActivity(
        'Training updated',
        `${editFormData.title} training has been updated`,
        'update'
      );
      
      toast({
        title: "Training Updated",
        description: `${editFormData.title} has been updated successfully and added to instructor's schedule.`
      });
      
      setEditOpen(false);
      setEditingTraining(null);
    } catch (error) {
      console.error('Error updating training:', error);
      toast({
        title: "Error",
        description: "Failed to update training. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInstructorSchedule = (training: Training, isEdit: boolean = false) => {
    const { instructorId, id, title, startTime, endDate, scheduledDays } = training;
    
    if (!instructorId || !startTime || !scheduledDays || !endDate) return;
    
    const instructorSchedule = instructorSchedules.find(
      schedule => schedule.instructorId === instructorId
    );
    
    if (instructorSchedule) {
      let updatedTrainings = isEdit 
        ? instructorSchedule.trainings.filter(t => t.id !== id)
        : [...instructorSchedule.trainings];
      
      updatedTrainings.push({
        id,
        title,
        startTime,
        endDate,
        scheduledDays
      });
      
      const updatedSchedules = instructorSchedules.map(schedule => 
        schedule.instructorId === instructorId 
          ? { ...schedule, trainings: updatedTrainings }
          : schedule
      );
      
      setInstructorSchedules(updatedSchedules);
    } else {
      const newSchedule: InstructorSchedule = {
        instructorId,
        trainings: [{
          id,
          title,
          startTime,
          endDate,
          scheduledDays
        }]
      };
      
      setInstructorSchedules([...instructorSchedules, newSchedule]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { hasConflicts, conflictingDates, trainingTitle } = checkScheduleConflicts(
      formData.instructorId,
      formData.scheduledDays
    );
    
    if (hasConflicts) {
      setScheduleConflicts({
        conflictingDates,
        trainingTitle
      });
      setConflictDialogOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newTrainingPayload = {
        title: formData.title,
        year: parseInt(formData.year.toString(), 10),
        duration: parseInt(formData.duration.toString(), 10),
        budget: parseInt(formData.budget.toString(), 10),
        domainId: parseInt(formData.domainId, 10),
        instructorId: parseInt(formData.instructorId, 10)
      };

      const response = await axios.post('http://localhost:8080/api/trainings', newTrainingPayload);
      const newTrainingId = response.data.id;
      
      const foundDomain = domains.find(d => d.id.toString() === formData.domainId);
      const foundInstructor = instructors.find(i => i.id.toString() === formData.instructorId);
      
      const startDate = new Date(formData.startDate);
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(startDate.getDate() + parseInt(formData.duration.toString(), 10) - 1);
      
      const newTraining = {
        id: newTrainingId,
        title: formData.title,
        year: parseInt(formData.year.toString(), 10),
        duration: parseInt(formData.duration.toString(), 10),
        domainId: parseInt(formData.domainId, 10),
        domainName: foundDomain?.title,
        budget: parseInt(formData.budget.toString(), 10),
        instructorId: parseInt(formData.instructorId, 10),
        instructorName: foundInstructor ? `${foundInstructor.firstName} ${foundInstructor.lastName}` : 'Unknown Instructor',
        status: "Upcoming",
        participants: 0,
        startDate: formData.startDate,
        endDate: calculatedEndDate.toISOString().split('T')[0],
        scheduledDays: formData.scheduledDays
      };
      
      setTrainings([...trainings, newTraining]);
      
      updateInstructorSchedule(newTraining);
      
      logActivity(
        'New training added',
        `${formData.title} training has been created`,
        'create'
      );
      
      toast({
        title: "Training Created",
        description: `${formData.title} has been added successfully and added to instructor's schedule.`
      });
      
      setOpen(false);
      setFormData({
        title: '',
        year: new Date().getFullYear(),
        duration: 8,
        domainId: '',
        budget: 0,
        instructorId: '',
        startDate: '',
        scheduledDays: []
      });
    } catch (error) {
      console.error('Error creating training:', error);
      toast({
        title: "Error",
        description: "Failed to create training instructor chosen is already associated. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteTraining = (id: number) => {
    setTrainingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTraining = async () => {
    if (trainingToDelete === null) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("training to ddelete: ", trainingToDelete);
      await axios.delete(`http://localhost:8080/api/trainings/${trainingToDelete}`);
      
      const deletedTraining = trainings.find(training => training.id === trainingToDelete);
      
      if (deletedTraining && deletedTraining.instructorId) {
        const instructorSchedule = instructorSchedules.find(
          schedule => schedule.instructorId === deletedTraining.instructorId
        );
        
        if (instructorSchedule) {
          const updatedTrainings = instructorSchedule.trainings.filter(
            t => t.id !== trainingToDelete
          );
          
          const updatedSchedules = instructorSchedules.map(schedule => 
            schedule.instructorId === deletedTraining.instructorId 
              ? { ...schedule, trainings: updatedTrainings }
              : schedule
          );
          
          setInstructorSchedules(updatedSchedules);
        }
      }
      
      const updatedTrainings = trainings.filter(training => training.id !== trainingToDelete);
      setTrainings(updatedTrainings);
      
      if (deletedTraining) {
        logActivity(
          'Training deleted',
          `${deletedTraining.title} training has been removed`,
          'delete'
        );
      }
      
      toast({
        title: "Training Deleted",
        description: `${deletedTraining?.title || 'The training'} has been removed successfully.`
      });
    } catch (error) {
      console.error('Error deleting training:', error);
      toast({
        title: "Error",
        description: "Failed to delete training. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
      setIsSubmitting(false);
    }
  };
  
  const getScheduleDates = (startDateStr: string, days: number = 14): string[] => {
    if (!startDateStr) return [];
    
    const startDate = new Date(startDateStr);
    const dates: string[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };
  const getTrainingStatus = (training) => {
    const startDateTime = new Date(training.startTime); // Parse the start time
    const currentDate = new Date(); // Get the current date
    const endDateTime = new Date(startDateTime);
    endDateTime.setDate(startDateTime.getDate() + training.duration); // Add the duration in days to the start time
    console.log("start date: ",startDateTime);
    if (currentDate < startDateTime) {
      // Current date is before the start time
      return 'Upcoming';
    } else if (currentDate > endDateTime) {
      // Current date is after the end time
      
      return 'Completed';
    } else {
      // Current date is between the start time and end time
      return 'Active';
    }
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    value={formData.duration}
                    onChange={handleInputChange}
                    min={1}
                    max={30}
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
                      {
                      domains.map(domain => (
                        <SelectItem key={domain.id} value={domain.id.toString()}>
                          {domain.title}
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
                        {instructor.firstName} - {instructor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              {formData.startDate && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Days
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                    {getScheduleDates(formData.startDate).map((date) => {
                      const isSelected = formData.scheduledDays.includes(date);
                      const dateObj = new Date(date);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <Button
                          key={date}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={`flex flex-col h-16 ${isSelected ? 'bg-admin text-white' : ''}`}
                          onClick={() => handleScheduleDaysChange(date)}
                        >
                          <span className="text-xs font-medium">{dayName}</span>
                          <span className="text-sm">{formattedDate}</span>
                        </Button>
                      );
                    })}
                  </div>
                  {formData.scheduledDays.length === 0 && (
                    <p className="text-sm text-yellow-600 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Please select at least one day for the training schedule
                    </p>
                  )}
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-admin text-white"
                  disabled={formData.scheduledDays.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Training"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="edit-duration">Duration (days)</Label>
                <Input 
                  id="edit-duration" 
                  name="duration" 
                  type="number" 
                  value={editFormData.duration}
                  onChange={(e) => handleInputChange(e, true)}
                  min={1}
                  max={30}
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
                      {domain.title}
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
                      {instructor.firstName} - {instructor.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input 
                id="edit-startDate" 
                name="startDate" 
                type="date" 
                value={editFormData.startDate}
                onChange={(e) => handleInputChange(e, true)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            {editFormData.startDate && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Days
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                  {getScheduleDates(editFormData.startDate).map((date) => {
                    const isSelected = editFormData.scheduledDays.includes(date);
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    return (
                      <Button
                        key={date}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`flex flex-col h-16 ${isSelected ? 'bg-admin text-white' : ''}`}
                        onClick={() => handleScheduleDaysChange(date, true)}
                      >
                        <span className="text-xs font-medium">{dayName}</span>
                        <span className="text-sm">{formattedDate}</span>
                      </Button>
                    );
                  })}
                </div>
                {editFormData.scheduledDays.length === 0 && (
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Please select at least one day for the training schedule
                  </p>
                )}
              </div>
            )}
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-admin text-white"
                disabled={editFormData.scheduledDays.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Training"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
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
            <AlertDialogCancel onClick={() => setTrainingToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTraining} 
              className="bg-destructive text-destructive-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={conflictDialogOpen} onOpenChange={setConflictDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Scheduling Conflict Detected
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-2">
                The instructor already has a scheduled training on the following dates:
              </p>
              <ul className="list-disc list-inside mb-2">
                {scheduleConflicts?.conflictingDates.map(date => (
                  <li key={date}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </li>
                ))}
              </ul>
              <p>
                This conflicts with the existing training: <strong>{scheduleConflicts?.trainingTitle}</strong>
              </p>
              <p className="mt-2 text-sm">
                Please select different dates or assign a different instructor.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setConflictDialogOpen(false)}>
              Adjust Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading training data...</span>
        </div>  
      ) : trainings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No trainings found</h3>
          <p className="mt-2 text-gray-500">Click "Add New Training" to create your first training.</p>
        </div>
      ) : (
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
                      getTrainingStatus(training) === 'Active' ? 'text-green-600' : 
                      getTrainingStatus(training) === 'Upcoming' ? 'text-blue-600' :
                      getTrainingStatus(training) === 'Completed' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>{getTrainingStatus(training)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium">{training.participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{training.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Instructor:</span>
                    <span className="font-medium">{training.instructorName}</span>
                  </div>
                  {training.startTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{training.startTime}</span>
                    </div>
                  )}
                  {training.scheduledDays && training.scheduledDays.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        Scheduled Days:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {training.scheduledDays.slice(0, 3).map(day => (
                          <span key={day} className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        ))}
                        {training.scheduledDays.length > 3 && (
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            +{training.scheduledDays.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
      )}
    </div>
  );
};

export default TrainingsPage;
