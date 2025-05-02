import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Briefcase, GraduationCap, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { userInfo } from 'os';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Monthly statistics data
// const monthlyData = [
//   { month: 'Jan', trainings: 4, participants: 15, budget: 2000 },
//   { month: 'Feb', trainings: 6, participants: 22, budget: 3200 },
//   { month: 'Mar', trainings: 8, participants: 30, budget: 4500 },
//   { month: 'Apr', trainings: 10, participants: 42, budget: 6000 },
//   { month: 'May', trainings: 7, participants: 28, budget: 4200 },
//   { month: 'Jun', trainings: 9, participants: 35, budget: 5100 },
// ];

// const trainingData = [
//   { name: 'Advanced JavaScript', participants: 28, revenue: 5600 },
//   { name: 'React Fundamentals', participants: 32, revenue: 6400 },
//   { name: 'Python for Data Science', participants: 24, revenue: 4800 },
//   { name: 'Machine Learning', participants: 18, revenue: 8100 },
//   { name: 'UX/UI Design', participants: 22, revenue: 4400 },
//   { name: 'DevOps Essentials', participants: 15, revenue: 6000 },
// ];

// const totalParticipantss = trainingData.reduce((sum, item) => sum + item.participants, 0);

// const pieChartData = trainingData.map(item => ({
//   ...item,
//   percentage: Math.round((item.participants / totalParticipantss) * 100)
// }));

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

const lineChartConfig = {
  trainings: {
    label: 'Trainings',
    color: '#4f46e5',
  },
  participants: {
    label: 'Participants',
    color: '#10b981',
  },
  budget: {
    label: 'Budget ($)',
    color: '#f59e0b',
  },
};

const AdminDashboard: React.FC = () => {
  const [totalTrainings, setTotalTrainings] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [totalInstructors, setTotalInstructors] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);
  const [trainingData, setTrainingData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  useEffect(() => {
    // Fetch total trainings from the API
    // Fetch training data and calculate participant distribution
    const fetchParticipantDistribution = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainings');
        const trainings = response.data;

        // Calculate total participants across all trainings
        const total = trainings.reduce((sum: number, training: any) => {
          return sum + (training.participantsIds?.length || 0);
        }, 0);

        // Transform data for the pie chart
        const transformedData = trainings.map((training: any) => ({
          name: training.title,
          participants: training.participantsIds?.length || 0,
          percentage: total > 0 ? Math.round(((training.participantsIds?.length || 0) / total) * 100) : 0,
        }));
        setPieChartData(transformedData);
      } catch (error) {
        console.error('Error fetching participant distribution:', error);
      }
    };



    const fetchTotalTrainings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainings');
        const trainings = response.data;
        setTotalTrainings(trainings.length);

        const totalBudget = trainings.reduce((sum, training) => {
          return sum + (training.budget || 0);
        }, 0);

        setBudget(totalBudget);
      } catch (error) {
        console.error('Error fetching total trainings:', error);
      }
    };
    // Fetch training summary data 
    const fetchTrainingSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainings/summary');
        const summaryData = response.data;

        // Transform the response data to match the chart structure
        const transformedData = summaryData.map((item: any) => ({
          name: item.trainingName,
          participants: item.participantCount,
          revenue: item.budget,
        }));
        setTrainingData(transformedData);
      } catch (error) {
        console.error('Error fetching training summary:', error);
      }
    };



    const fetchTotalParticipant = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/participants');
        const participants = response.data;
        const totalEnrollments = participants.reduce((sum, participant) => {
          return sum + (participant.trainingIds?.length || 0);
        }, 0);

        setTotalParticipants(totalEnrollments);
      } catch (error) {
        console.error('Error fetching total Participants:', error);
      }
    };

    // Fetch total instructors
    const fetchTotalInstructors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/instructors');
        const instructors = response.data;
        setTotalInstructors(instructors.length);
      } catch (error) {
        console.error('Error fetching total instructors:', error);
      }
    };
    // Fetch monthly statistics data
    const fetchMonthlyStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/trainings/last-6-months-stats');
        const statsData = response.data;

        // Transform the response data to match the chart structure
        const transformedData = statsData.map((item: any) => ({
          month: item.month,
          trainings: item.totalTrainings,
          participants: item.totalParticipants,
          budget: item.totalRevenue,
        }));

        setMonthlyData(transformedData);
      } catch (error) {
        console.error('Error fetching monthly statistics:', error);
      }
    };

    fetchMonthlyStats();

    fetchTrainingSummary();
    fetchParticipantDistribution();
    fetchTotalTrainings();
    fetchTotalParticipant();
    fetchTotalInstructors();
  }, []);

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
        <h1 className="page-title">Dashboard</h1>
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

      <div className="dashboard-card flex justify-center  h-[600px]">
        <div >
          <h2 className="text-xl font-small text-gray-900 mb-6 ">Monthly Training Statistics</h2>
          <ChartContainer className="h-[500px]" config={lineChartConfig}>
            <LineChart data={monthlyData} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke={lineChartConfig.trainings.color} />
              <YAxis yAxisId="right" orientation="right" stroke={lineChartConfig.participants.color} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="trainings"
                stroke={lineChartConfig.trainings.color}
                activeDot={{ r: 8 }}
                name="Trainings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="participants"
                stroke={lineChartConfig.participants.color}
                name="Participants"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="budget"
                stroke={lineChartConfig.budget.color}
                name="Budget ($)"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
