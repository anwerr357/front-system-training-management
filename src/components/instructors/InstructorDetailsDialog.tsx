
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, Calendar, Building2, GraduationCap } from 'lucide-react';
import { useInstructor, useInstructorTrainings } from '@/hooks/useInstructors';

interface InstructorDetailsDialogProps {
  instructorId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructorDetailsDialog: React.FC<InstructorDetailsDialogProps> = ({
  instructorId,
  open,
  onOpenChange
}) => {
  const { data: instructor, isLoading: isLoadingInstructor, error: instructorError } = useInstructor(instructorId);
  const { 
    data: trainings, 
    isLoading: isLoadingTrainings, 
    error: trainingsError 
  } = useInstructorTrainings(instructorId);

  const isLoading = isLoadingInstructor || isLoadingTrainings;
  const hasError = instructorError || trainingsError;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Instructor Details</DialogTitle>
          <DialogDescription>
            View instructor information and assigned trainings
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading instructor details...</p>
          </div>
        ) : hasError ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading instructor details. Please try again.</p>
          </div>
        ) : instructor ? (
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="trainings">Trainings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{instructor.name}</CardTitle>
                  <CardDescription>{instructor.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{instructor.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{instructor.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Available: {instructor.availability}</span>
                  </div>
                  {instructor.employerId && (
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 mr-3 text-gray-500" />
                      <span>Employer ID: {instructor.employerId}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trainings" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Trainings</CardTitle>
                  <CardDescription>Trainings this instructor is teaching</CardDescription>
                </CardHeader>
                <CardContent>
                  {trainings && trainings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainings.map((training) => (
                          <TableRow key={training.id}>
                            <TableCell className="font-medium">{training.title}</TableCell>
                            <TableCell>{training.startDate}</TableCell>
                            <TableCell>{training.endDate}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                training.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                training.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                training.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {training.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No trainings assigned to this instructor yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No instructor selected.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorDetailsDialog;
