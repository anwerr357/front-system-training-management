
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from 'lucide-react';

const TrainingsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 8,
    domainId: '',
    budget: 0,
    instructorId: ''
  });

  // Sample data for instructors and domains
  const instructors = [
    { id: 1, name: 'Dr. Robert Chen', specialty: 'Web Development' },
    { id: 2, name: 'Prof. Lisa Wong', specialty: 'Data Science' },
    { id: 3, name: 'Dr. Michael Taylor', specialty: 'UI/UX Design' },
    { id: 4, name: 'Prof. Sarah Johnson', specialty: 'Mobile Development' }
  ];

  const domains = [
    { id: 1, name: 'Information Technology' },
    { id: 2, name: 'Business Analytics' },
    { id: 3, name: 'Design' },
    { id: 4, name: 'Project Management' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting training data:", formData);
    // Here you would normally send the data to your backend
    // After successful submission:
    setOpen(false);
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      duration: 8,
      domainId: '',
      budget: 0,
      instructorId: ''
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trainings Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Training
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Training</DialogTitle>
              <DialogDescription>
                Create a new training program by filling out the form below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter training title" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    value={formData.year}
                    onChange={handleInputChange}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    value={formData.duration}
                    onChange={handleInputChange}
                    min={1}
                    max={52}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('domainId', value)}
                  value={formData.domainId}
                >
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id.toString()}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input 
                  id="budget" 
                  name="budget" 
                  type="number" 
                  value={formData.budget}
                  onChange={handleInputChange}
                  min={0}
                  step={100}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('instructorId', value)}
                  value={formData.instructorId}
                >
                  <SelectTrigger id="instructor">
                    <SelectValue placeholder="Select an instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map(instructor => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name} - {instructor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  Create Training
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle>Web Development</CardTitle>
            <CardDescription>Frontend development fundamentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Participants:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">8 weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle>Data Science</CardTitle>
            <CardDescription>Python and data analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-blue-600">Upcoming</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Participants:</span>
                <span className="font-medium">16</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">12 weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle>UI/UX Design</CardTitle>
            <CardDescription>User interface design principles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-yellow-600">In Review</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Participants:</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">6 weeks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingsPage;
