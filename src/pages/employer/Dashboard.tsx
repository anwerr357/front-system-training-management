import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, BookOpen, Search, Plus, Trash, Edit, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useTrainings } from '@/hooks/useTrainings';
import { useInstructors, useInstructorActions, InstructorFormData } from '@/hooks/useInstructors';
import { useUsers } from '@/hooks/useUsers';
import { useEmployers } from '@/hooks/useEmployers';
import InstructorFormDialog from '@/components/instructors/InstructorFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Monthly statistics data
const monthlyData = [
  { month: 'Jan', trainings: 2, participants: 8, completion: 50 },
  { month: 'Feb', trainings: 3, participants: 12, completion: 33 },
  { month: 'Mar', trainings: 4, participants: 15, completion: 75 },
  { month: 'Apr', trainings: 3, participants: 18, completion: 66 },
  { month: 'May', trainings: 5, participants: 20, completion: 40 },
  { month: 'Jun', trainings: 4, participants: 17, completion: 25 },
];

const COLORS = ['#10b981', '#f59e0b', '#4f46e5', '#ef4444', '#8b5cf6', '#ec4899'];

const lineChartConfig = {
  trainings: {
    label: 'Trainings',
    color: '#4f46e5',
  },
  participants: {
    label: 'Participants',
    color: '#10b981',
  },
  completion: {
    label: 'Completion Rate (%)',
    color: '#f59e0b',
  },
};

const barChartConfig = {
  participants: {
    label: 'Participants',
    color: '#4f46e5',
  }
};

const EmployerDashboard: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [trainingData, setTrainingData] = useState([]);
  
  // Fetch trainings
  const { data: trainings = [], isLoading: isLoadingTrainings } = useTrainings();
  
  // Fetch instructors
  const { data: instructors = [], isLoading: isLoadingInstructors } = useInstructors();
  
  // Get instructor actions
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorActions();
  
  // Get instructor userIds for filtering
  const instructorUserIds = instructors.map(instructor => instructor.id);
  
  // Fetch users for instructor form
  // const { eligibleUsers, isLoading: isLoadingUsers } = useUsers(instructorUserIds, []);
  
  // Fetch employers for instructor form
  const { employers, isLoading: isLoadingEmployers } = useEmployers();

  useEffect(() => {
    if (trainings.length > 0) {
      // Process training data for charts
      const chartData = trainings.map(training => ({
        name: training.title,
        participants: training.enrolledCount || 0,
        revenue: training.budget || 0
      }));
      
      setTrainingData(chartData);
    }
  }, [trainings]);
  
  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    instructor => 
      (instructor.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (instructor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      ||(instructor.phone.toLowerCase() || '').includes(searchTerm.toLowerCase())

  );
  
  // Stats calculations
  const activeTrainings = trainings.filter(t => t.status === 'Active' || t.status === 'Upcoming').length;
  const totalParticipants = trainings.reduce((acc, training) => acc + (training.enrolledCount || 0), 0);
  const completionRate = trainings.length > 0 
    ? Math.round((trainings.filter(t => t.status === 'Completed').length / trainings.length) * 100) 
    : 0;
  
  // Handle instructor form submission
  const handleInstructorSubmit = (data: InstructorFormData) => {
    console.log('Submitting instructor:', data); // Debug log
    if (selectedInstructor) {
      // Update existing instructor
      updateInstructor.mutate({
        id: selectedInstructor,
        data
      }, {
        onSuccess: () => {
          toast({
            title: "Instructor Updated",
            description: "The instructor has been updated successfully."
          });
          setIsFormOpen(false);
          setSelectedInstructor(null);
        }
      });
    } else {
      console.log("data", data);
      // Create new instructor
      createInstructor.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Instructor Added",
            description: "The new instructor has been added successfully."
          });
          setIsFormOpen(false);
        }
      });
    }
  };
  
  // Handle instructor deletion
  const handleDeleteInstructor = () => {
    if (confirmDeleteId) {
      deleteInstructor.mutate(confirmDeleteId, {
        onSuccess: () => {
          toast({
            title: "Instructor Removed",
            description: "The instructor has been removed successfully."
          });
          setConfirmDeleteId(null);
        }
      });
    }
  };
  
  // Loading state
  const isLoading = isLoadingTrainings || isLoadingInstructors  || isLoadingEmployers;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employer Dashboard</h1>
        <p className="text-gray-600">Manage your organization's trainings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 mr-4">
              <BookOpen className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trainings</p>
              <p className="text-2xl font-bold text-gray-900">{activeTrainings}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 mr-4">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Participants</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 mr-4">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="dashboard-card h-96">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Training Statistics</h2>
          <div className="h-[calc(100%-3rem)]">
            {trainingData.length > 0 ? (
              <ChartContainer className="h-full" config={barChartConfig}>
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
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participants" name="Participants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No training data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card h-96">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Statistics</h2>
          <div className="h-[calc(100%-3rem)]">
            <ChartContainer className="h-full" config={lineChartConfig}>
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  dataKey="completion" 
                  stroke={lineChartConfig.completion.color}
                  name="Completion Rate (%)"
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Trainings Section */}
      <div className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            {trainings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Training Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Instructor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainings
                      .filter(training => training.status === 'Upcoming' || training.status === 'Active')
                      .map(training => (
                        <TableRow key={training.id}>
                          <TableCell className="font-medium">{training.title}</TableCell>
                          <TableCell>{new Date(training.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(training.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              training.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {training.status}
                            </span>
                          </TableCell>
                          <TableCell>{training.enrolledCount || 0}</TableCell>
                          <TableCell>{training.instructorName || 'Not assigned'}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No upcoming trainings found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructors Management Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Instructors</h2>
          <Button 
            onClick={() => {
              setSelectedInstructor(null);
              setIsFormOpen(true);
            }}
            className="bg-employer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Instructor
          </Button>
        </div>
        
        <div className="relative w-full md:w-72 mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search instructors..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Card>
          <CardContent className="p-0">
            {filteredInstructors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstructors.map(instructor => (
                    <TableRow key={instructor.id}>
                      <TableCell className="font-medium">{instructor.firstName}</TableCell>
                      <TableCell>{instructor.email}</TableCell>
                      <TableCell>{instructor.phone}</TableCell>
                      <TableCell>{instructor.type || 'Full Time'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInstructor(instructor.id);
                                setIsFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setConfirmDeleteId(instructor.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-6 text-gray-500">No instructors found. Add one to get started.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Instructor Form Dialog */}
      <InstructorFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleInstructorSubmit}
        instructor={selectedInstructor ? instructors.find(i => i.id === selectedInstructor) || null : null}
        employers={employers.data || []}
        isLoading={isLoadingEmployers}
      />
      
      {/* Confirmation Dialog for Instructor Deletion */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this instructor? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteInstructor}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerDashboard;
