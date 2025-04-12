
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';

interface Participant {
  id: number;
  name: string;
  email: string;
  status: string;
  progress: string;
  training: string;
  startDate?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ParticipantsPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: 1, 
      name: 'Alex Johnson', 
      email: 'alex.j@example.com', 
      status: 'Active', 
      progress: '78%', 
      training: 'Web Development',
      startDate: '2025-01-15'
    },
    { 
      id: 2, 
      name: 'Sarah Miller', 
      email: 's.miller@example.com', 
      status: 'Active', 
      progress: '92%', 
      training: 'Data Science',
      startDate: '2025-02-01' 
    },
    { 
      id: 3, 
      name: 'James Wilson', 
      email: 'jwilson@example.com', 
      status: 'On Leave', 
      progress: '45%', 
      training: 'UI/UX Design',
      startDate: '2025-02-15'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily.d@example.com', 
      status: 'Active', 
      progress: '67%', 
      training: 'Web Development',
      startDate: '2025-03-01'
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      email: 'mbrown@example.com', 
      status: 'Inactive', 
      progress: '23%', 
      training: 'Data Science',
      startDate: '2025-03-15'
    },
  ]);
  
  // Available users that can be enrolled as participants
  const users: User[] = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Participant' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@example.com', role: 'Participant' },
    { id: 3, name: 'James Wilson', email: 'jwilson@example.com', role: 'Participant' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Participant' },
    { id: 5, name: 'Michael Brown', email: 'mbrown@example.com', role: 'Participant' },
    { id: 6, name: 'Jessica Lee', email: 'jlee@example.com', role: 'Participant' },
    { id: 7, name: 'Robert Smith', email: 'rsmith@example.com', role: 'Participant' },
    { id: 8, name: 'Lisa Wang', email: 'lwang@example.com', role: 'Participant' },
  ];
  
  const [formData, setFormData] = useState({
    userId: '',
    training: ''
  });
  
  const trainings = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'DevOps Essentials',
    'Machine Learning'
  ];
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected user
    const selectedUser = users.find(user => user.id.toString() === formData.userId);
    
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a valid user.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user is already enrolled in this training
    const isAlreadyEnrolled = participants.some(
      p => p.email === selectedUser.email && p.training === formData.training
    );
    
    if (isAlreadyEnrolled) {
      toast({
        title: "Already Enrolled",
        description: `${selectedUser.name} is already enrolled in ${formData.training}.`,
        variant: "destructive"
      });
      return;
    }
    
    // Get current date for start date
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    // Create new participant
    const newParticipant: Participant = {
      id: participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1,
      name: selectedUser.name,
      email: selectedUser.email,
      status: 'Active', // Default status
      progress: '0%',
      training: formData.training,
      startDate: startDate
    };
    
    // Add to state
    setParticipants([...participants, newParticipant]);
    
    // Log this activity
    logActivity(
      'Participant added',
      `${selectedUser.name} enrolled in ${formData.training} training`,
      'create'
    );
    
    // Show success toast
    toast({
      title: "Participant Enrolled",
      description: `${selectedUser.name} has been enrolled in ${formData.training}.`
    });
    
    // Reset form and close dialog
    setFormData({
      userId: '',
      training: ''
    });
    setOpen(false);
  };

  // Calculate progress based on start date and duration
  const calculateProgress = (startDate?: string): string => {
    if (!startDate) return "0%";
    
    // Assuming each training is 90 days
    const trainingDuration = 90;
    
    const start = new Date(startDate);
    const today = new Date();
    
    // Calculate days passed
    const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate progress percentage
    let progressPercent = Math.floor((daysPassed / trainingDuration) * 100);
    
    // Cap at 100%
    if (progressPercent > 100) progressPercent = 100;
    if (progressPercent < 0) progressPercent = 0;
    
    return `${progressPercent}%`;
  };

  // Update participants' progress based on current date
  const participantsWithUpdatedProgress = participants.map(participant => ({
    ...participant,
    progress: calculateProgress(participant.startDate)
  }));

  // Filter participants based on search term
  const filteredParticipants = participantsWithUpdatedProgress.filter(
    participant => 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.training.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participants</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white">
              <UserPlus size={18} className="mr-2" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll User in Training</DialogTitle>
              <DialogDescription>Select an existing user and a training program to enroll them.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('userId', value)}
                  value={formData.userId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="training">Training</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('training', value)}
                  value={formData.training}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a training" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainings.map((training) => (
                      <SelectItem key={training} value={training}>
                        {training}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  Enroll Participant
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search participants..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <TableHead>Start Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
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
                <TableCell>{participant.startDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ParticipantsPage;
