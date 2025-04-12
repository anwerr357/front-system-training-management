
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from 'lucide-react';

const ParticipantsPage: React.FC = () => {
  const participants = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', status: 'Active', progress: '78%', training: 'Web Development' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@example.com', status: 'Active', progress: '92%', training: 'Data Science' },
    { id: 3, name: 'James Wilson', email: 'jwilson@example.com', status: 'On Leave', progress: '45%', training: 'UI/UX Design' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', status: 'Active', progress: '67%', training: 'Web Development' },
    { id: 5, name: 'Michael Brown', email: 'mbrown@example.com', status: 'Inactive', progress: '23%', training: 'Data Science' },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participants</h1>
        <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={18} />
          Add Participant
        </button>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input placeholder="Search participants..." className="pl-8" />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Training</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{participant.name}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    participant.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    participant.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {participant.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: participant.progress }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{participant.progress}</span>
                </TableCell>
                <TableCell>{participant.training}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ParticipantsPage;
