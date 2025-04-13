import React, { useState } from 'react';
import { CheckCheck, X, Clock, Download, Award, Calendar, CalendarDays, CalendarClock } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

const UserProgressPage: React.FC = () => {
  const { toast } = useToast();
  // Get current date
  const currentDate = new Date();
  const [viewMode, setViewMode] = useState<'progress' | 'schedule'>('progress');
  
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
  
  const calculateProgress = (startDateStr: string, endDateStr: string): number => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // If training hasn't started yet
    if (currentDate < startDate) return 0;
    
    // If training has completed
    if (currentDate > endDate) return 100;
    
    // Calculate progress percentage based on date
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const daysElapsed = (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    const progress = Math.round((daysElapsed / totalDays) * 100);
    return Math.min(100, Math.max(0, progress)); // Ensure between 0-100
  };
  
  const getStatusFromProgress = (progress: number, startDate: string): string => {
    const start = new Date(startDate);
    
    if (currentDate < start) return 'Not Started';
    if (progress >= 100) return 'Completed';
    return 'In Progress';
  };
  
  const trainings = [
    { 
      name: 'Introduction to Project Management', 
      startDate: 'Jan 15, 2025',
      endDate: 'Jan 17, 2025',
      certificate: true,
      description: 'Learn the fundamentals of project management including planning, execution, and monitoring.',
      time: '9:00 AM - 4:00 PM',
      location: 'Training Center - Room 101'
    },
    { 
      name: 'Data Analysis Fundamentals', 
      startDate: 'Feb 10, 2025',
      endDate: 'Feb 14, 2025', 
      certificate: true,
      description: 'Master the basics of data analysis, including statistical methods and visualization techniques.',
      time: '10:00 AM - 3:00 PM',
      location: 'Online (Zoom)'
    },
    { 
      name: 'Effective Communication', 
      startDate: 'Mar 5, 2025',
      endDate: 'Mar 7, 2025', 
      certificate: false,
      description: 'Develop crucial communication skills for professional environments and team collaboration.',
      time: '1:00 PM - 5:00 PM',
      location: 'Training Center - Room 102'
    },
    { 
      name: 'Leadership Skills', 
      startDate: 'Mar 20, 2025',
      endDate: 'Mar 22, 2025', 
      certificate: false,
      description: 'Build essential leadership capabilities including team management and strategic thinking.',
      time: '9:00 AM - 5:00 PM',
      location: 'Training Center - Room 103'
    },
    { 
      name: 'Cloud Computing Essentials', 
      startDate: 'April 20, 2025',
      endDate: 'April 22, 2025', 
      certificate: false,
      description: 'Explore fundamental cloud concepts, services, and implementation strategies.',
      time: '10:00 AM - 2:00 PM',
      location: 'Online (Zoom)'
    },
  ];

  const handleCertificateDownload = (training: any) => {
    try {
      // Create certificate HTML content
      const certificateContent = `
        <html>
          <head>
            <title>Certificate of Completion</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
              .certificate { border: 10px solid #333; padding: 30px; }
              h1 { font-size: 36px; margin-bottom: 20px; }
              .name { font-size: 28px; margin: 20px 0; font-weight: bold; }
              .course { font-size: 24px; margin: 10px 0; }
              .date { font-size: 18px; margin: 20px 0; }
              .signature { margin-top: 60px; border-top: 1px solid #333; padding-top: 10px; width: 200px; margin: 60px auto 0; }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>Certificate of Completion</h1>
              <p>This certifies that</p>
              <p class="name">Participant User</p>
              <p>has successfully completed</p>
              <p class="course">${training.name}</p>
              <p class="date">${training.startDate} - ${training.endDate}</p>
              <p class="signature">Training Director</p>
              <p>Certificate ID: CERT-${Date.now().toString().slice(-6)}</p>
            </div>
          </body>
        </html>
      `;
      
      // Create a Blob from the HTML content
      const blob = new Blob([certificateContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate - ${training.name}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded successfully."
      });
    } catch (error) {
      console.error("Certificate download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your certificate. Please try again.",
        variant: "destructive"
      });
    }
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

  const totalTrainings = trainings.length;
  const completedTrainings = trainingsWithProgress.filter(t => t.status === 'Completed').length;
  const inProgressTrainings = trainingsWithProgress.filter(t => t.status === 'In Progress').length;
  const notStartedTrainings = trainingsWithProgress.filter(t => t.status === 'Not Started').length;
  const overallProgress = Math.round((completedTrainings / totalTrainings) * 100);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><CheckCheck className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'Not Started':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200"><X className="h-3 w-3 mr-1" />Not Started</Badge>;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate} to ${endDate}`;
  };

  const isUpcoming = (startDate: string) => {
    const start = new Date(startDate);
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    return start > currentDate && start <= oneWeekFromNow;
  };

  const upcomingTrainings = [...trainingsWithProgress]
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Award className="h-6 w-6 text-participant-soft" />
          My Progress
        </h1>
        <p className="text-gray-600">Track your training progress and completion status</p>
      </div>

      <Tabs defaultValue="progress" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">Progress View</TabsTrigger>
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your training completion summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="grid grid-cols-3 gap-6 w-full md:w-auto">
                  <div className="text-center p-4 bg-green-50 rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-green-700">{completedTrainings}</p>
                    <p className="text-sm text-green-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-blue-700">{inProgressTrainings}</p>
                    <p className="text-sm text-blue-600">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg shadow-sm">
                    <p className="text-3xl font-bold text-yellow-700">{notStartedTrainings}</p>
                    <p className="text-sm text-yellow-600">Not Started</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-2" 
                  indicatorColor="bg-green-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Trainings</CardTitle>
              <CardDescription>Details of all your enrolled trainings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Training</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Progress</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trainingsWithProgress.map((training, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <span className="cursor-help font-medium text-gray-900 hover:text-participant transition-colors">
                                {training.name}
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h3 className="font-medium">{training.name}</h3>
                                <p className="text-sm text-gray-500">{training.description}</p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {training.startDate} to {training.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(training.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(training.status)}`} 
                                style={{ width: `${training.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{training.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {training.certificate && training.status === 'Completed' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-participant hover:text-participant-light hover:bg-participant/5"
                              onClick={() => handleCertificateDownload(training)}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Certificate
                            </Button>
                          ) : (
                            <span className="text-gray-400">Not Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-participant-soft" />
                Training Schedule
              </CardTitle>
              <CardDescription>View the schedule of your upcoming trainings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingTrainings.length > 0 ? (
                  upcomingTrainings.map((training, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${isUpcoming(training.startDate) ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium">{training.name}</h3>
                            {isUpcoming(training.startDate) && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                Upcoming
                              </Badge>
                            )}
                            {getStatusBadge(training.status)}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{training.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                              {formatDateRange(training.startDate, training.endDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="mr-2 h-4 w-4 text-gray-400" />
                              {training.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 col-span-2">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              {training.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center">
                            {training.status === 'Not Started' ? (
                              <>
                                <span className="text-xs text-gray-500">Starting in</span>
                                <span className="text-lg font-bold text-participant">
                                  {Math.ceil((new Date(training.startDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))}
                                </span>
                                <span className="text-xs text-gray-500">days</span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-lg font-bold text-participant">{training.progress}%</span>
                                <span className="text-xs text-gray-500">complete</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <CalendarClock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No upcoming trainings</p>
                    <p className="text-sm">Check back later or enroll in new trainings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProgressPage;
