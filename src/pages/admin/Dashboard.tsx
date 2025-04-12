import React from 'react';
import { BarChart3, Users, Briefcase, GraduationCap, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock data for the chart
const trainingData = [
  { name: 'Advanced JavaScript', participants: 28, revenue: 5600 },
  { name: 'React Fundamentals', participants: 32, revenue: 6400 },
  { name: 'Python for Data Science', participants: 24, revenue: 4800 },
  { name: 'Machine Learning', participants: 18, revenue: 8100 },
  { name: 'UX/UI Design', participants: 22, revenue: 4400 },
  { name: 'DevOps Essentials', participants: 15, revenue: 6000 },
];

// Calculate total participants for pie chart
const totalParticipants = trainingData.reduce((sum, item) => sum + item.participants, 0);

// Add percentage to the data for the pie chart
const pieChartData = trainingData.map(item => ({
  ...item,
  percentage: Math.round((item.participants / totalParticipants) * 100)
}));

// Colors for pie chart
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Chart configuration
const chartConfig = {
  participants: {
    label: 'Participants',
    color: '#4f46e5', // indigo
  },
  revenue: {
    label: 'Revenue ($)',
    color: '#10b981', // emerald
  },
};

const AdminDashboard: React.FC = () => {
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
              <p className="text-2xl font-bold text-gray-900">42</p>
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
              <p className="text-2xl font-bold text-gray-900">256</p>
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
              <p className="text-2xl font-bold text-gray-900">18</p>
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
              <p className="text-2xl font-bold text-gray-900">$156,400</p>
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
                />
                <YAxis yAxisId="left" orientation="left" stroke={chartConfig.participants.color} />
                <YAxis yAxisId="right" orientation="right" stroke={chartConfig.revenue.color} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        return name === 'revenue' ? `$${value}` : value;
                      }}
                    />
                  }
                />
                <Legend />
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

        <div className="dashboard-card h-96">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Participant Distribution</h2>
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="participants"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const percentage = props.payload.percentage;
                    return [`${value} (${percentage}%)`, 'Participants'];
                  }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-card h-96">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start pb-4 border-b last:border-b-0 border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">{i}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New training added: Advanced Machine Learning</p>
                <p className="text-xs text-gray-500">1 hour ago by John Smith</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
