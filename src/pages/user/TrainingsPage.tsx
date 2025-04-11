
import React from 'react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

const UserTrainingsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Available Trainings</h1>
        <p className="text-gray-600">Browse and enroll in upcoming training courses</p>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search trainings..."
            className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-participant"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex space-x-2">
          <select className="py-2 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-participant">
            <option value="">All Categories</option>
            <option value="technical">Technical</option>
            <option value="soft-skills">Soft Skills</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {[
          { 
            id: 1, 
            title: 'Introduction to Cloud Computing', 
            category: 'Technical',
            date: 'May 10-12, 2025', 
            time: '9:00 AM - 4:00 PM', 
            location: 'Training Center - Room 101',
            capacity: '20 spots available',
            description: 'Learn the fundamentals of cloud computing, including AWS, Azure, and Google Cloud services.',
            enrolled: false
          },
          { 
            id: 2, 
            title: 'Effective Communication Skills', 
            category: 'Soft Skills',
            date: 'May 20-21, 2025', 
            time: '10:00 AM - 3:00 PM', 
            location: 'Training Center - Room 102',
            capacity: '15 spots available',
            description: 'Develop key communication skills for professional success in the workplace.',
            enrolled: true
          },
          { 
            id: 3, 
            title: 'Leadership Development', 
            category: 'Leadership',
            date: 'June 5-7, 2025', 
            time: '9:00 AM - 5:00 PM', 
            location: 'Online (Zoom)',
            capacity: '10 spots available',
            description: 'Enhance your leadership skills through practical exercises and case studies.',
            enrolled: false
          }
        ].map((training) => (
          <div key={training.id} className="dashboard-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900 mr-3">{training.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {training.category}
                  </span>
                </div>
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
                    <BookOpen className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.capacity}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{training.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                {training.enrolled ? (
                  <button disabled className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-md">
                    Enrolled
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-participant text-white text-sm font-medium rounded-md hover:bg-participant-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-participant">
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTrainingsPage;
