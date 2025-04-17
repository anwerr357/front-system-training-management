
import React from 'react';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SchedulePage: React.FC = () => {
  // Static schedule data
  const scheduleItems = [
    {
      id: 1,
      title: 'Advanced JavaScript Programming',
      date: 'May 5, 2025',
      time: '9:00 AM - 12:00 PM',
      location: 'Training Center - Room 201',
      participants: 18,
      type: 'Lecture',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'JavaScript Workshop: Closures & Prototypes',
      date: 'May 5, 2025',
      time: '1:00 PM - 4:00 PM',
      location: 'Training Center - Room 201',
      participants: 18,
      type: 'Workshop',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Introduction to Data Science',
      date: 'May 15, 2025',
      time: '10:00 AM - 3:00 PM',
      location: 'Online (Zoom)',
      participants: 25,
      type: 'Lecture',
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Project Management Session 1',
      date: 'June 1, 2025',
      time: '9:00 AM - 12:00 PM',
      location: 'Training Center - Room 105',
      participants: 15,
      type: 'Lecture',
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'JavaScript Fundamentals',
      date: 'April 15, 2025',
      time: '9:00 AM - 4:00 PM',
      location: 'Training Center - Room 201',
      participants: 20,
      type: 'Workshop',
      status: 'completed'
    },
    {
      id: 6,
      title: 'Frontend Development Basics',
      date: 'April 10, 2025',
      time: '10:00 AM - 3:00 PM',
      location: 'Online (Zoom)',
      participants: 22,
      type: 'Lecture',
      status: 'completed'
    }
  ];

  const upcomingSessions = scheduleItems.filter(item => item.status === 'upcoming');
  const completedSessions = scheduleItems.filter(item => item.status === 'completed');

  // Get today's date for the header
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getStatusBadge = (status: string, type: string) => {
    if (status === 'upcoming') {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          {type}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-gray-500 border-gray-300">
          Completed
        </Badge>
      );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teaching Schedule</h1>
          <p className="text-gray-600">Today is {formattedDate}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Calendar className="mr-2 h-5 w-5 text-instructor" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                          <div className="ml-3">
                            {getStatusBadge(session.status, session.type)}
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.participants} participants
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming sessions</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any upcoming teaching sessions scheduled.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BookOpen className="mr-2 h-5 w-5 text-gray-500" />
              Past Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedSessions.length > 0 ? (
              <div className="space-y-4">
                {completedSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-500">{session.title}</h3>
                          <div className="ml-3">
                            {getStatusBadge(session.status, session.type)}
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                            {session.participants} participants
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No past sessions</h3>
                <p className="mt-1 text-sm text-gray-500">Your completed teaching sessions will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;
