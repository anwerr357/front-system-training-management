
import React from 'react';
import { CheckCheck, X, Clock } from 'lucide-react';

const UserProgressPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Progress</h1>
        <p className="text-gray-600">Track your training progress and completion status</p>
      </div>

      <div className="dashboard-card mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Overall Progress</h2>
            <p className="text-sm text-gray-600">Your training completion summary</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-600">Not Started</p>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-participant h-4 rounded-full" style={{ width: '62.5%' }}></div>
        </div>
        <div className="mt-2 text-right text-sm text-gray-600">62.5% Complete</div>
      </div>

      <div className="dashboard-card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">My Trainings</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Training
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { 
                  name: 'Introduction to Project Management', 
                  date: 'Jan 15-17, 2025', 
                  status: 'Completed', 
                  progress: 100,
                  certificate: true 
                },
                { 
                  name: 'Data Analysis Fundamentals', 
                  date: 'Feb 10-14, 2025', 
                  status: 'Completed', 
                  progress: 100,
                  certificate: true 
                },
                { 
                  name: 'Effective Communication', 
                  date: 'Mar 5-7, 2025', 
                  status: 'In Progress', 
                  progress: 60,
                  certificate: false 
                },
                { 
                  name: 'Leadership Skills', 
                  date: 'Mar 20-22, 2025', 
                  status: 'In Progress', 
                  progress: 30,
                  certificate: false 
                },
                { 
                  name: 'Cloud Computing Essentials', 
                  date: 'April 20-22, 2025', 
                  status: 'Not Started', 
                  progress: 0,
                  certificate: false 
                },
              ].map((training, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {training.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {training.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      training.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : training.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <span className="mr-1">
                        {training.status === 'Completed' 
                          ? <CheckCheck className="h-3 w-3" /> 
                          : training.status === 'In Progress'
                            ? <Clock className="h-3 w-3" />
                            : <X className="h-3 w-3" />
                        }
                      </span>
                      {training.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          training.status === 'Completed' 
                            ? 'bg-green-500' 
                            : training.status === 'In Progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                        }`} 
                        style={{ width: `${training.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{training.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {training.certificate ? (
                      <a 
                        href="#" 
                        className="text-participant hover:text-participant-light underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProgressPage;
