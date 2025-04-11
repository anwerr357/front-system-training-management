
import React from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

const InstructorTrainingsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Trainings</h1>
        <p className="text-gray-600">View and manage your assigned trainings</p>
      </div>

      <div className="grid gap-6">
        {[
          { 
            id: 1, 
            title: 'Advanced JavaScript Programming', 
            date: 'May 5-7, 2025', 
            time: '9:00 AM - 4:00 PM', 
            location: 'Training Center - Room 201',
            participants: 18,
            description: 'A comprehensive course covering advanced JavaScript concepts including closures, prototypes, and async programming.'
          },
          { 
            id: 2, 
            title: 'Introduction to Data Science', 
            date: 'May 15-16, 2025', 
            time: '10:00 AM - 3:00 PM', 
            location: 'Online (Zoom)',
            participants: 25,
            description: 'An introductory course to data science fundamentals, covering statistics, Python, and data visualization basics.'
          },
          { 
            id: 3, 
            title: 'Project Management Fundamentals', 
            date: 'June 1-5, 2025', 
            time: '9:00 AM - 5:00 PM', 
            location: 'Training Center - Room 105',
            participants: 15,
            description: 'Learn the essential skills needed to successfully manage projects, including planning, execution, and monitoring.'
          }
        ].map((training) => (
          <div key={training.id} className="dashboard-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{training.title}</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.date}
                  </div>
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
                <p className="mt-2 text-sm text-gray-600">{training.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="px-4 py-2 bg-instructor text-white text-sm font-medium rounded-md hover:bg-instructor-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instructor">
                  View Details
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instructor">
                  Materials
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorTrainingsPage;
