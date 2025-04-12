
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
}

const ParticipantsPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', status: 'Active', progress: '78%', training: 'Web Development' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@example.com', status: 'Active', progress: '92%', training: 'Data Science' },
    { id: 3, name: 'James Wilson', email: 'jwilson@example.com', status: 'On Leave', progress: '45%', training: 'UI/UX Design' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', status: 'Active', progress: '67%', training: 'Web Development' },
    { id: 5, name: 'Michael Brown', email: 'mbrown@example.com', status: 'Inactive', progress: '23%', training: 'Data Science' },
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    training: ''
  });
  
  const trainings = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'DevOps Essentials',
    'Machine Learning'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, training: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new participant
    const newParticipant: Participant = {
      id: participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1,
      name: formData.name,
      email: formData.email,
      status: 'Active',
      progress: '0%',
      training: formData.training
    };
    
    // Add to state
    setParticipants([...participants, newParticipant]);
    
    // Log this activity
    logActivity(
      'Participant added',
      `New participant ${formData.name} joined ${formData.training} training`,
      'create'
    );
    
    // Show success toast
    toast({
      title: "Participant Added",
      description: `${formData.name} has been added to ${formData.training}.`
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      training: ''
    });
    setOpen(false);
  };

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
              <DialogTitle>Add New Participant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="training">Training</Label>
                <Select 
                  onValueChange={handleSelectChange}
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
                  Add Participant
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
