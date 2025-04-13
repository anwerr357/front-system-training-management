import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, MapPin, Download, ListChecks, ClipboardEdit } from 'lucide-react';
import RequestForm from "@/components/user/RequestForm";
import UserRequests from "@/components/user/UserRequests";

// Mock data for trainings
const trainings = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming',
    startDate: '2025-03-15',
    endDate: '2025-04-30',
    type: 'Web Development',
    location: 'Online',
    schedule: [
      { date: '2025-04-15', time: '10:00 AM - 12:00 PM', location: 'Online Room A' },
      { date: '2025-04-22', time: '10:00 AM - 12:00 PM', location: 'Online Room A' },
      { date: '2025-04-29', time: '10:00 AM - 12:00 PM', location: 'Online Room A' },
    ]
  },
  {
    id: '2',
    title: 'React Framework',
    description: 'Learn to build applications with React',
    startDate: '2025-03-01',
    endDate: '2025-04-15',
    type: 'Web Development',
    location: 'Tech Center, Room 204',
    schedule: [
      { date: '2025-04-01', time: '2:00 PM - 4:00 PM', location: 'Tech Center, Room 204' },
      { date: '2025-04-08', time: '2:00 PM - 4:00 PM', location: 'Tech Center, Room 204' },
      { date: '2025-04-15', time: '2:00 PM - 4:00 PM', location: 'Tech Center, Room 204' },
    ]
  },
  {
    id: '3',
    title: 'UX/UI Design Principles',
    description: 'Learn the fundamentals of user experience and interface design',
    startDate: '2025-05-01',
    endDate: '2025-06-15',
    type: 'Design',
    location: 'Design Studio, Floor 3',
    schedule: [
      { date: '2025-05-05', time: '1:00 PM - 3:00 PM', location: 'Design Studio, Floor 3' },
      { date: '2025-05-12', time: '1:00 PM - 3:00 PM', location: 'Design Studio, Floor 3' },
      { date: '2025-05-19', time: '1:00 PM - 3:00 PM', location: 'Design Studio, Floor 3' },
    ]
  }
];

// Get current date
const currentDate = new Date();
  
const ProgressPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'progress' | 'schedule'>('progress');
  const [selectedTab, setSelectedTab] = useState("progress");
  
  // New method to calculate progress based on status
  const calculateProgressByStatus = (status: string): number => {
    switch(status) {
      case 'Completed':
        return 100;
      case 'In Progress':
        return 50;
      case 'Not Started':
      default:
        return 0;
    }
  };
  
  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = end.getTime() - start.getTime();
    const current = currentDate.getTime() - start.getTime();
    
    let progress = (current / total) * 100;
    
    if (progress < 0) {
      progress = 0;
    } else if (progress > 100) {
      progress = 100;
    }
    
    return Math.round(progress);
  };
  
  const getStatusFromProgress = (progress: number, startDate: string): string => {
    const start = new Date(startDate);
    
    if (currentDate < start) {
      return 'Not Started';
    } else if (progress < 100) {
      return 'In Progress';
    } else {
      return 'Completed';
    }
  };
  
  const downloadCertificate = (trainingTitle: string) => {
    alert(`Downloading certificate for ${trainingTitle}! (Not implemented yet)`);
  };
  
  const trainingsWithProgress = trainings.map(training => {
    const dateProgress = calculateProgress(training.startDate, training.endDate);
    const status = getStatusFromProgress(dateProgress, training.startDate);
    // Calculate progress based on status instead of date
    const progress = calculateProgressByStatus(status);
    return {
      ...training,
      progress,
      dateProgress,
      status
    };
  });
  
  const filteredTrainings = trainingsWithProgress.filter(training => {
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    return start <= currentDate && currentDate <= end;
  });
  
  const overallProgress = filteredTrainings.reduce((acc, training) => acc + training.progress, 0) / filteredTrainings.length || 0;
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">My Progress</h1>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="progress">Training Progress</TabsTrigger>
          <TabsTrigger value="schedule">Upcoming Schedule</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="space-y-6">
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your current progress across all active trainings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} />
              <p className="mt-2 text-sm text-muted-foreground">
                {Math.round(overallProgress)}% Complete
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingsWithProgress.map((training) => (
              <Card key={training.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{training.title}</CardTitle>
                  <CardDescription>{training.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{training.startDate} - {training.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    <span>Status: <Badge variant="secondary">{training.status}</Badge></span>
                  </div>
                  <Progress value={training.progress} />
                  <p className="text-sm text-muted-foreground">
                    {training.progress}% Complete
                  </p>
                  <Button variant="outline" onClick={() => downloadCertificate(training.title)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your schedule for upcoming training sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainings.map((training) => (
                <div key={training.id} className="space-y-2">
                  <h2 className="text-xl font-semibold">{training.title}</h2>
                  {training.schedule.map((session, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{session.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RequestForm />
          <UserRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
