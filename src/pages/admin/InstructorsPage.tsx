
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Mail, Phone, Calendar } from 'lucide-react';

const InstructorsPage: React.FC = () => {
  const instructors = [
    { 
      id: 1, 
      name: 'Dr. Robert Chen', 
      specialty: 'Web Development', 
      email: 'dr.chen@example.com',
      phone: '+1 (555) 123-4567',
      availability: 'Mon-Wed',
      image: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    { 
      id: 2, 
      name: 'Prof. Lisa Wong', 
      specialty: 'Data Science', 
      email: 'lwong@example.com',
      phone: '+1 (555) 987-6543',
      availability: 'Tue-Fri',
      image: 'https://randomuser.me/api/portraits/women/2.jpg' 
    },
    { 
      id: 3, 
      name: 'Dr. Michael Taylor', 
      specialty: 'UI/UX Design', 
      email: 'mtaylor@example.com',
      phone: '+1 (555) 456-7890',
      availability: 'Wed-Sat',
      image: 'https://randomuser.me/api/portraits/men/3.jpg' 
    },
    { 
      id: 4, 
      name: 'Prof. Sarah Johnson', 
      specialty: 'Mobile Development', 
      email: 'sjohnson@example.com',
      phone: '+1 (555) 234-5678',
      availability: 'Mon-Thu',
      image: 'https://randomuser.me/api/portraits/women/4.jpg' 
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructors</h1>
        <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <GraduationCap size={18} />
          Add Instructor
        </button>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input placeholder="Search instructors..." className="pl-8" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <img 
                src={instructor.image} 
                alt={instructor.name}
                className="h-20 w-20 rounded-full border-4 border-white object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-center">{instructor.name}</CardTitle>
              <p className="text-center text-sm text-gray-500">{instructor.specialty}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{instructor.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{instructor.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Available: {instructor.availability}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorsPage;
