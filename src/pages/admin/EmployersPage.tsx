
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MapPin, Globe, Plus, Edit, Trash, MoreVertical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';

interface Employer {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  partnership: string;
  website: string;
  logo: string;
  trainees: number;
  userId?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const EmployersPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployer, setCurrentEmployer] = useState<Employer | null>(null);

  const [employers, setEmployers] = useState<Employer[]>([
    {
      id: 1,
      name: 'TechSolutions Inc.',
      industry: 'Software Development',
      location: 'San Francisco, CA',
      employees: 120,
      partnership: 'Gold',
      website: 'techsolutions.example.com',
      logo: 'https://placehold.co/200x200/4F46E5/FFFFFF/png?text=T&font=montserrat',
      trainees: 12,
      userId: 1
    },
    {
      id: 2,
      name: 'DataVision Analytics',
      industry: 'Data Science',
      location: 'Boston, MA',
      employees: 85,
      partnership: 'Silver',
      website: 'datavision.example.com',
      logo: 'https://placehold.co/200x200/2563EB/FFFFFF/png?text=D&font=montserrat',
      trainees: 8,
      userId: 2
    },
    {
      id: 3,
      name: 'Innovate UX',
      industry: 'Design & UI/UX',
      location: 'Austin, TX',
      employees: 45,
      partnership: 'Bronze',
      website: 'innovateux.example.com',
      logo: 'https://placehold.co/200x200/9333EA/FFFFFF/png?text=I&font=montserrat',
      trainees: 5,
      userId: 3
    },
    {
      id: 4,
      name: 'MobileFuture',
      industry: 'Mobile Development',
      location: 'Seattle, WA',
      employees: 60,
      partnership: 'Silver',
      website: 'mobilefuture.example.com',
      logo: 'https://placehold.co/200x200/0EA5E9/FFFFFF/png?text=M&font=montserrat',
      trainees: 7,
      userId: 4
    }
  ]);

  // Available users that can become employer representatives
  const users: User[] = [
    { id: 1, name: 'John Smith', email: 'john.smith@techsolutions.example.com', role: 'Employer' },
    { id: 2, name: 'Anna Chen', email: 'anna.chen@datavision.example.com', role: 'Employer' },
    { id: 3, name: 'Marcus Johnson', email: 'marcus.j@innovateux.example.com', role: 'Employer' },
    { id: 4, name: 'Sophia Lee', email: 'sophia.l@mobilefuture.example.com', role: 'Employer' },
    { id: 5, name: 'David Garcia', email: 'david.g@example.com', role: 'Employer' },
    { id: 6, name: 'Maria Rodriguez', email: 'maria.r@example.com', role: 'Employer' },
    { id: 7, name: 'James Wilson', email: 'james.w@example.com', role: 'Employer' },
    { id: 8, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Employer' },
  ];

  const industries = [
    'Software Development',
    'Data Science',
    'Design & UI/UX',
    'Mobile Development',
    'Cloud Services',
    'Cybersecurity',
    'E-commerce',
    'Financial Services'
  ];

  const partnershipLevels = [
    'Gold',
    'Silver',
    'Bronze'
  ];

  const [formData, setFormData] = useState({
    userId: '',
    companyName: '',
    industry: '',
    location: '',
    employees: '',
    partnership: '',
    website: '',
    trainees: ''
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      userId: '',
      companyName: '',
      industry: '',
      location: '',
      employees: '',
      partnership: '',
      website: '',
      trainees: '0'
    });
    setEditMode(false);
    setOpen(true);
  };

  const openEditDialog = (employer: Employer) => {
    setCurrentEmployer(employer);
    setFormData({
      userId: employer.userId?.toString() || '',
      companyName: employer.name,
      industry: employer.industry,
      location: employer.location,
      employees: employer.employees.toString(),
      partnership: employer.partnership,
      website: employer.website,
      trainees: employer.trainees.toString()
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const employerToDelete = employers.find(e => e.id === id);
    
    if (employerToDelete) {
      setEmployers(employers.filter(employer => employer.id !== id));
      
      toast({
        title: "Employer Removed",
        description: `${employerToDelete.name} has been removed from partners.`
      });
      
      logActivity(
        'Employer removed',
        `${employerToDelete.name} was removed from the employer partners list`,
        'delete'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for required fields
    if (!formData.companyName || !formData.industry || !formData.location || 
        !formData.employees || !formData.partnership || !formData.website) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected user if provided
    const selectedUser = formData.userId ? users.find(user => user.id.toString() === formData.userId) : null;
    
    if (formData.userId && !selectedUser) {
      toast({
        title: "Error",
        description: "Please select a valid user representative.",
        variant: "destructive"
      });
      return;
    }
    
    const employeeCount = parseInt(formData.employees);
    const traineeCount = parseInt(formData.trainees || '0');
    
    if (isNaN(employeeCount) || employeeCount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of employees.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(traineeCount) || traineeCount < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of trainees.",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && currentEmployer) {
      // Update existing employer
      const updatedEmployers = employers.map(employer => 
        employer.id === currentEmployer.id
          ? {
              ...employer,
              name: formData.companyName,
              industry: formData.industry,
              location: formData.location,
              employees: employeeCount,
              partnership: formData.partnership,
              website: formData.website,
              trainees: traineeCount,
              userId: selectedUser ? selectedUser.id : employer.userId
            }
          : employer
      );
      
      setEmployers(updatedEmployers);
      
      toast({
        title: "Employer Updated",
        description: `${formData.companyName}'s information has been updated.`
      });
      
      logActivity(
        'Employer updated',
        `${formData.companyName}'s profile was updated`,
        'update'
      );
    } else {
      // Check if employer already exists
      const employerExists = employers.some(
        employer => employer.name.toLowerCase() === formData.companyName.toLowerCase()
      );
      
      if (employerExists) {
        toast({
          title: "Employer Exists",
          description: `${formData.companyName} is already registered as a partner.`,
          variant: "destructive"
        });
        return;
      }
      
      // Generate a logo based on the first letter of company name
      const firstLetter = formData.companyName.charAt(0).toUpperCase();
      const colors = ['4F46E5', '2563EB', '9333EA', '0EA5E9', 'EC4899', 'F59E0B', '10B981'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const logo = `https://placehold.co/200x200/${randomColor}/FFFFFF/png?text=${firstLetter}&font=montserrat`;
      
      // Create new employer
      const newEmployer: Employer = {
        id: employers.length > 0 ? Math.max(...employers.map(e => e.id)) + 1 : 1,
        name: formData.companyName,
        industry: formData.industry,
        location: formData.location,
        employees: employeeCount,
        partnership: formData.partnership,
        website: formData.website,
        logo: logo,
        trainees: traineeCount,
        userId: selectedUser?.id
      };
      
      setEmployers([...employers, newEmployer]);
      
      toast({
        title: "Employer Added",
        description: `${formData.companyName} has been added as a partner.`
      });
      
      logActivity(
        'Employer added',
        `${formData.companyName} was added as a new employer partner`,
        'create'
      );
    }
    
    // Reset form and close dialog
    setFormData({
      userId: '',
      companyName: '',
      industry: '',
      location: '',
      employees: '',
      partnership: '',
      website: '',
      trainees: ''
    });
    setCurrentEmployer(null);
    setOpen(false);
  };

  // Filter employers based on search term and active tab
  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = 
      employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      employer.partnership.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  // Render employer card
  const renderEmployerCard = (employer: Employer) => (
    <Card key={employer.id} className="overflow-hidden">
      <div className={`h-32 flex items-center justify-center relative
        ${employer.partnership === 'Gold' ? 'bg-amber-500' : 
          employer.partnership === 'Silver' ? 'bg-gray-400' : 
          'bg-amber-700'}`}>
        <img 
          src={employer.logo} 
          alt={employer.name}
          className="h-16 w-16 object-contain"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/20 text-white hover:bg-white/30">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(employer)}>
                <Edit size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(employer.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {employer.name}
        </CardTitle>
        <CardDescription>{employer.industry}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          <span>{employer.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span>{employer.employees} employees</span>
        </div>
        <div className="flex items-center text-sm">
          <Globe className="h-4 w-4 mr-2 text-gray-500" />
          <span>{employer.website}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-4 py-3">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm text-gray-600">Trainees:</span>
          <span className="font-medium">{employer.trainees}</span>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employer Partners</h1>
        <Button className="bg-admin text-white" onClick={openAddDialog}>
          <Plus size={18} className="mr-2" />
          Add Employer
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search employers..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="gold">Gold</TabsTrigger>
            <TabsTrigger value="silver">Silver</TabsTrigger>
            <TabsTrigger value="bronze">Bronze</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEmployers.map(renderEmployerCard)}
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Employer' : 'Add New Employer'}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? 'Update the employer information below.' 
                : 'Fill in the details for the new employer partner.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                name="companyName" 
                placeholder="Enter company name" 
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userId">User Representative (Optional)</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('userId', value)}
                value={formData.userId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user representative" />
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
              <Label htmlFor="industry">Industry</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('industry', value)}
                value={formData.industry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="City, State" 
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input 
                  id="employees" 
                  name="employees" 
                  type="number" 
                  min="1"
                  placeholder="e.g., 50" 
                  value={formData.employees}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trainees">Number of Trainees</Label>
                <Input 
                  id="trainees" 
                  name="trainees" 
                  type="number" 
                  min="0"
                  placeholder="e.g., 5" 
                  value={formData.trainees}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partnership">Partnership Level</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('partnership', value)}
                value={formData.partnership}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partnership level" />
                </SelectTrigger>
                <SelectContent>
                  {partnershipLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website" 
                placeholder="e.g., company.example.com" 
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-admin text-white">
                {editMode ? 'Update Employer' : 'Add Employer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployersPage;
