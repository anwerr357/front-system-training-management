
import React, { useState } from 'react';
import { useTrainings, useTrainingActions } from '@/hooks/useTrainings';
import { useDomains } from '@/hooks/useDomains';
import { useInstructors } from '@/hooks/useInstructors';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TrainingFormDialog from '@/components/trainings/TrainingFormDialog';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TrainingFormData } from '@/types/training';

const EmployerTrainingsPage = () => {
  const { toast } = useToast();
  const { data: trainings = [], isLoading: isLoadingTrainings } = useTrainings();
  const { domains, isLoading: isLoadingDomains } = useDomains();
  const { data: instructors = [] } = useInstructors();
  const { createTraining, updateTraining, deleteTraining } = useTrainingActions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const handleSubmit = async (data: TrainingFormData) => {
    try {
      if (selectedTraining) {
        await updateTraining.mutateAsync({
          id: selectedTraining.id,
          data: {
            ...data
          }
        });
        toast({ title: "Training Updated", description: "Training has been updated successfully." });
      } else {
        await createTraining.mutateAsync({
          ...data
        });
        toast({ title: "Training Created", description: "Training has been created successfully." });
      }
      setIsFormOpen(false);
      setSelectedTraining(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!trainingToDelete) return;
    
    try {
      await deleteTraining.mutateAsync(trainingToDelete.id);
      toast({ title: "Training Deleted", description: "Training has been deleted successfully." });
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to format time with AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  // Helper function to find instructor name by ID
  const getInstructorName = (instructorId: number) => {
    const instructor = instructors.find(i => i.id === instructorId);
    if (instructor) {
      return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim();
    }
    return 'Not assigned';
  };

  const calculateStatus = (startDate: string, startTime: string, duration: number) => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));
    const now = new Date();

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Active';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Training Programs</h1>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add New Training
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => {
          const status = calculateStatus(training.startTime, training.startTime, training.duration);
          const startDateTime = new Date(training.startTime);
          console.log('training: ', startDateTime)
          const endDateTime = new Date(startDateTime.getTime() + (training.duration * 24 * 60 * 60 * 1000));
          const instructorName = getInstructorName(training.instructorId);
          const domainInfo = domains?.data?.find(d => d.id === training.domainId);

          return (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{training.title}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    status === 'Active' ? 'bg-green-100 text-green-800' :
                    status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {status}
                  </span>
                </CardTitle>
                <CardDescription>{domainInfo?.title || 'Unknown Domain'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Start: {startDateTime.toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  Time: {training.duration}

                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  End: {endDateTime.toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  Duration: {training.duration} day{training.duration !== 1 ? 's' : ''}
                </div>
                <p className="text-sm mt-2 font-medium">
                  Instructor: {instructorName}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTraining(training);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setTrainingToDelete(training);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {trainings.length === 0 && !isLoadingTrainings && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No trainings found</p>
          <Button onClick={() => setIsFormOpen(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Training
          </Button>
        </div>
      )}

      <TrainingFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        training={selectedTraining}
        domains={domains?.data || []}
        instructors={instructors}
        isLoading={isLoadingTrainings}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the training.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployerTrainingsPage;
