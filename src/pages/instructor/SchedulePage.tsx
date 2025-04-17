import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, MapPin, FileText } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, parseISO } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const API_URL = 'http://localhost:8080/api';

const InstructorSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      if (!user) {
        setLoading(false);
        setError('User not authenticated');
        return;
      }

      try {
        const instructorId = user.id;
        
        const response = await axios.get(`${API_URL}/instructors/${instructorId}/trainings`);
        
        const formattedTrainings = response.data.map((training: any) => ({ 
          id: training.id, 
          title: training.title, 
          startDate: training.startDate,
          endDate: training.endDate,
          time: training.time || '9:00 AM - 4:00 PM',
          location: training.location || 'Training Center',
          participants: training.participantCount || 15,
          description: training.description || 'No description available',
          materials: []
        }));
        
        setTrainings(formattedTrainings);
      } catch (err) {
        console.error('Error fetching instructor trainings:', err);
        setError('Failed to fetch trainings');
        
        toast({
          variant: "destructive",
          title: "Error fetching schedule",
          description: "Could not retrieve your training schedule. Using sample data instead."
        });
        
        setTrainings([
          { 
            id: 1, 
            title: 'Advanced JavaScript Programming', 
            startDate: '2025-05-05', 
            endDate: '2025-05-07', 
            time: '9:00 AM - 4:00 PM', 
            location: 'Training Center - Room 201',
            participants: 18,
            description: 'A comprehensive course covering advanced JavaScript concepts including closures, prototypes, and async programming.',
            materials: [
              { id: 1, name: 'Course Syllabus', type: 'PDF' },
              { id: 2, name: 'JavaScript Examples', type: 'ZIP' },
              { id: 3, name: 'Lecture Slides', type: 'PPTX' }
            ]
          },
          { 
            id: 2, 
            title: 'Data Science Intro', 
            startDate: '2025-05-15', 
            endDate: '2025-05-16', 
            time: '10:00 AM - 3:00 PM', 
            location: 'Online (Zoom)',
            participants: 25,
            description: 'An introductory course to data science fundamentals, covering statistics, Python, and data visualization basics.',
            materials: [
              { id: 1, name: 'Python Basics', type: 'PDF' },
              { id: 2, name: 'Data Sets', type: 'CSV' },
              { id: 3, name: 'Jupyter Notebooks', type: 'ZIP' }
            ]
          },
          { 
            id: 3, 
            title: 'React Fundamentals', 
            startDate: '2025-04-10', 
            endDate: '2025-04-12', 
            time: '9:00 AM - 5:00 PM', 
            location: 'Training Center - Room 105',
            participants: 15,
            description: 'Learn the essential concepts of React, including components, state, and hooks.',
            materials: [
              { id: 1, name: 'React Setup Guide', type: 'PDF' },
              { id: 2, name: 'Component Examples', type: 'ZIP' },
              { id: 3, name: 'Exercise Solutions', type: 'ZIP' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [user, toast]);

  const getCurrentMonthDays = () => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    
    return eachDayOfInterval({ start: firstDay, end: lastDay });
  };

  const calendarDays = getCurrentMonthDays();

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const getTrainingsForDate = (date: Date) => {
    return trainings.filter(training => {
      const startDate = parseISO(training.startDate);
      const endDate = parseISO(training.endDate);
      
      return (date >= startDate && date <= endDate);
    });
  };

  const openTrainingDetails = (training: any) => {
    setSelectedTraining(training);
    setIsDialogOpen(true);
  };

  const getPastTrainings = () => {
    const today = new Date();
    return trainings.filter(training => {
      const endDate = parseISO(training.endDate);
      return isBefore(endDate, today);
    });
  };

  const getCurrentTrainings = () => {
    const today = new Date();
    return trainings.filter(training => {
      const startDate = parseISO(training.startDate);
      const endDate = parseISO(training.endDate);
      return (startDate <= today && endDate >= today);
    });
  };

  const getUpcomingTrainings = () => {
    const today = new Date();
    return trainings.filter(training => {
      const startDate = parseISO(training.startDate);
      return startDate > today;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-instructor"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Schedule</h1>
        <p className="text-gray-600">View your upcoming training sessions</p>
      </div>

      <div className="mb-4">
        <div className="flex">
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setViewMode('calendar')}
            className="mr-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
          >
            <FileText className="mr-2 h-4 w-4" />
            List View
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="dashboard-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {calendarDays.map((day, i) => {
                  const trainingsOnDay = getTrainingsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  
                  return (
                    <div
                      key={i}
                      className={`
                        bg-white p-2 h-32 text-sm overflow-y-auto
                        ${!isCurrentMonth ? 'text-gray-400' : ''}
                        ${isToday(day) ? 'bg-gray-50' : ''}
                      `}
                    >
                      <div className="text-sm font-medium">{format(day, 'd')}</div>
                      {trainingsOnDay.map((training) => (
                        <div 
                          key={training.id}
                          className="mt-1 rounded bg-instructor text-white p-1 text-xs cursor-pointer hover:bg-instructor-light transition-colors"
                          onClick={() => openTrainingDetails(training)}
                        >
                          {training.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {getUpcomingTrainings().length > 0 ? (
              <div className="grid gap-4">
                {getUpcomingTrainings().map(training => (
                  <Card key={training.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openTrainingDetails(training)}>
                    <CardHeader className="pb-2">
                      <CardTitle>{training.title}</CardTitle>
                      <CardDescription>{`${training.startDate} to ${training.endDate}`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.participants} participants
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No upcoming trainings scheduled</div>
            )}
          </TabsContent>
          
          <TabsContent value="current">
            {getCurrentTrainings().length > 0 ? (
              <div className="grid gap-4">
                {getCurrentTrainings().map(training => (
                  <Card key={training.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openTrainingDetails(training)}>
                    <CardHeader className="pb-2">
                      <CardTitle>{training.title}</CardTitle>
                      <CardDescription>{`${training.startDate} to ${training.endDate}`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.participants} participants
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No trainings currently in progress</div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {getPastTrainings().length > 0 ? (
              <div className="grid gap-4">
                {getPastTrainings().map(training => (
                  <Card key={training.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openTrainingDetails(training)}>
                    <CardHeader className="pb-2">
                      <CardTitle>{training.title}</CardTitle>
                      <CardDescription>{`${training.startDate} to ${training.endDate}`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                          {training.participants} participants
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No past trainings</div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedTraining && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTraining.title}</DialogTitle>
                <DialogDescription>
                  {`${selectedTraining.startDate} to ${selectedTraining.endDate} • ${selectedTraining.time}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                    {selectedTraining.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                    {selectedTraining.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                    {selectedTraining.participants} participants
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedTraining.description}</p>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Training Materials</h3>
                  <div className="space-y-2">
                    {selectedTraining.materials && selectedTraining.materials.map((material: any) => (
                      <div key={material.id} className="flex items-center">
                        <FileText className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {material.name} ({material.type})
                        </span>
                      </div>
                    ))}
                    {(!selectedTraining.materials || selectedTraining.materials.length === 0) && (
                      <p className="text-sm text-gray-500">No materials available</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorSchedulePage;
