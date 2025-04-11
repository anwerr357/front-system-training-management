
import React from 'react';
import { CheckCheck, X, Clock, Download, Award } from 'lucide-react';
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

const UserProgressPage: React.FC = () => {
  const trainings = [
    { 
      name: 'Introduction to Project Management', 
      date: 'Jan 15-17, 2025', 
      status: 'Completed', 
      progress: 100,
      certificate: true,
      description: 'Learn the fundamentals of project management including planning, execution, and monitoring.'
    },
    { 
      name: 'Data Analysis Fundamentals', 
      date: 'Feb 10-14, 2025', 
      status: 'Completed', 
      progress: 100,
      certificate: true,
      description: 'Master the basics of data analysis, including statistical methods and visualization techniques.'
    },
    { 
      name: 'Effective Communication', 
      date: 'Mar 5-7, 2025', 
      status: 'In Progress', 
      progress: 60,
      certificate: false,
      description: 'Develop crucial communication skills for professional environments and team collaboration.'
    },
    { 
      name: 'Leadership Skills', 
      date: 'Mar 20-22, 2025', 
      status: 'In Progress', 
      progress: 30,
      certificate: false,
      description: 'Build essential leadership capabilities including team management and strategic thinking.'
    },
    { 
      name: 'Cloud Computing Essentials', 
      date: 'April 20-22, 2025', 
      status: 'Not Started', 
      progress: 0,
      certificate: false,
      description: 'Explore fundamental cloud concepts, services, and implementation strategies.'
    },
  ];

  const totalTrainings = trainings.length;
  const completedTrainings = trainings.filter(t => t.status === 'Completed').length;
  const inProgressTrainings = trainings.filter(t => t.status === 'In Progress').length;
  const notStartedTrainings = trainings.filter(t => t.status === 'Not Started').length;
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

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Award className="h-6 w-6 text-participant" />
          My Progress
        </h1>
        <p className="text-gray-600">Track your training progress and completion status</p>
      </div>

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
            <Progress value={overallProgress} className="h-2" />
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
                {trainings.map((training, index) => (
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
                      {training.date}
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
                      {training.certificate ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-participant hover:text-participant-light hover:bg-participant/5"
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
    </div>
  );
};

export default UserProgressPage;
