import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Users, Briefcase, GraduationCap, DollarSign, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useActivityStore } from '@/utils/activityUtils';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

const trainingData = [
  { name: 'Advanced JavaScript', participants: 28, revenue: 5600 },
  { name: 'React Fundamentals', participants: 32, revenue: 6400 },
  { name: 'Python for Data Science', participants: 24, revenue: 4800 },
  { name: 'Machine Learning', participants: 18, revenue: 8100 },
  { name: 'UX/UI Design', participants: 22, revenue: 4400 },
  { name: 'DevOps Essentials', participants: 15, revenue: 6000 },
];

const totalParticipants = trainingData.reduce((sum, item) => sum + item.participants, 0);

const pieChartData = trainingData.map(item => ({
  ...item,
  percentage: Math.round((item.participants / totalParticipants) * 100)
}));

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const chartConfig = {
  participants: {
    label: 'Participants',
    color: '#4f46e5',
  },
  revenue: {
    label: 'Revenue ($)',
    color: '#10b981',
  },
};

const AdminDashboard: React.FC = () => {

  const [totalTrainings, setTotalTrainings] = useState<number>(0); // State for total trainings
  const [totalParticipants, setTotalParticipants] = useState<number>(0); // State for total trainings
  const [totalInstructors, setTotalInstructors] = useState<number>(0); // State for total trainings
  const [budget, setBudget] = useState<number>(0); // State for total budget

  useEffect(() => {
    // Fetch total trainings from the API
    const fetchTotalTrainings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainings');
        const trainings = response.data; // Assuming response.data is an array of trainings

        setTotalTrainings(trainings.length); // Count the number of trainings

        // Calculate the total budget
        const totalBudget = trainings.reduce((sum, training) => {
          return sum + (training.budget || 0); // Sum up the budget field, default to 0 if undefined
        }, 0);

        setBudget(totalBudget); // Set the total budget
      } catch (error) {
        console.error('Error fetching total trainings:', error);
      }
    };
    const fetchTotalParticipant = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/participants');
        const participants = response.data; // Assuming response.data is an array of participants
        // console.log(response);
        // Calculate the total number of training enrollments
        const totalEnrollments = participants.reduce((sum, participant) => {
          return sum + (participant.trainingIds?.length || 0); // Sum up the number of trainings for each participant
        }, 0);

        setTotalParticipants(totalEnrollments);
      }
      catch (error) {
        console.error('Error fetching total Participants:', error);
      }
    }
    // Fetch total instructors
    const fetchTotalInstructors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/instructors');
        const instructors = response.data; // Assuming response.data is an array of instructors
        console.log(response);

        setTotalInstructors(instructors.length); // Count the number of instructors
      } catch (error) {
        console.error('Error fetching total instructors:', error);
      }
    };






    fetchTotalTrainings();
    fetchTotalParticipant();
    fetchTotalInstructors();

  }, []);

  const recentActivities = useActivityStore(state => state.getRecentActivities(5));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <PlusCircle className="h-4 w-4 text-green-600" />;
      case 'update':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <PlusCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  // Custom renderer for the Pie Chart legend
  const renderCustomizedLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 px-4">
        {pieChartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-sm mr-1"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs">{entry.name}: {entry.percentage}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (  
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Training Management System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trainings</p>
              <p className="text-2xl font-bold text-gray-900">{totalTrainings}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Instructors</p>
              <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900">{budget}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="dashboard-card h-96">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Training Statistics</h2>
          <div className="h-full">
            <ChartContainer className="h-[300px]" config={chartConfig}>
              <BarChart data={trainingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                  interval={0}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke={chartConfig.participants.color}
                  padding={{ top: 20, bottom: 20 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={chartConfig.revenue.color}
                  padding={{ top: 20, bottom: 20 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        return name === 'revenue' ? `$${value}` : value;
                      }}
                    />
                  }
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                />
                <Bar
                  dataKey="participants"
                  name="Participants"
                  yAxisId="left"
                  fill={chartConfig.participants.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue ($)"
                  yAxisId="right"
                  fill={chartConfig.revenue.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="dashboard-card h-96 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Participant Distribution</h2>
          <div className="flex-grow flex flex-col justify-center items-center p-4">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="participants"
                  nameKey="name"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, 'Participants']} />
              </PieChart>
            </ResponsiveContainer>
            {renderCustomizedLegend()}
          </div>
        </div>
      </div>

      <div className="dashboard-card h-96">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
        <ScrollArea className="h-[calc(100%-3rem)]">
          <div className="space-y-4 pr-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b last:border-b-0 border-gray-200">
                <div className={`p-3 rounded-full mr-4 ${activity.type === 'create' ? 'bg-green-100' :
                    activity.type === 'update' ? 'bg-blue-100' :
                      'bg-red-100'
                  }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}: {activity.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })} by {activity.userName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminDashboard;
