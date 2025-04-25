
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, CalendarDays, GraduationCap, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Training {
  id: number;
  title: string;
  year: number;
  duration: number;
  domain: string;
  instructor: string;
  participants: number;
  status: 'Active' | 'Completed' | 'Upcoming';
}

const ReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample training data
  const trainings: Training[] = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      year: 2025,
      duration: 8,
      domain: "Information Technology",
      instructor: "Dr. Robert Chen",
      participants: 24,
      status: "Active"
    },
    {
      id: 2,
      title: "Data Science Essentials",
      year: 2025,
      duration: 12,
      domain: "Business Analytics",
      instructor: "Prof. Lisa Wong",
      participants: 16,
      status: "Upcoming"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      year: 2024,
      duration: 6,
      domain: "Design",
      instructor: "Dr. Michael Taylor",
      participants: 18,
      status: "Completed"
    },
    {
      id: 4,
      title: "Mobile App Development",
      year: 2024,
      duration: 10,
      domain: "Information Technology",
      instructor: "Prof. Sarah Johnson",
      participants: 20,
      status: "Completed"
    },
    {
      id: 5,
      title: "Cloud Computing",
      year: 2025,
      duration: 8,
      domain: "Information Technology",
      instructor: "Dr. James Wilson",
      participants: 15,
      status: "Upcoming"
    }
  ];

  // Filter trainings based on search term
  const filteredTrainings = trainings.filter(training => 
    training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const activeTrainings = trainings.filter(t => t.status === 'Active').length;
  const completedTrainings = trainings.filter(t => t.status === 'Completed').length;
  const upcomingTrainings = trainings.filter(t => t.status === 'Upcoming').length;
  const totalParticipants = trainings.reduce((sum, t) => sum + t.participants, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Training Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>Active Trainings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              {activeTrainings}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>Completed Trainings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-green-500" />
              {completedTrainings}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Trainings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
              {upcomingTrainings}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardDescription>Total Participants</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-amber-500" />
              {totalParticipants}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Training List</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search trainings..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training Title</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Duration (weeks)</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.title}</TableCell>
                  <TableCell>{training.domain}</TableCell>
                  <TableCell>{training.instructor}</TableCell>
                  <TableCell>{training.year}</TableCell>
                  <TableCell>{training.duration}</TableCell>
                  <TableCell>{training.participants}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${
                        training.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                        training.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {training.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
