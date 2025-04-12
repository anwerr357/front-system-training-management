
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, UserPlus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-04-10 09:45' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@example.com', role: 'Instructor', status: 'Active', lastLogin: '2025-04-11 14:30' },
    { id: 3, name: 'James Wilson', email: 'jwilson@example.com', role: 'Employer', status: 'Inactive', lastLogin: '2025-03-28 10:15' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Participant', status: 'Active', lastLogin: '2025-04-12 08:20' },
    { id: 5, name: 'Michael Brown', email: 'mbrown@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-04-11 16:45' },
    { id: 6, name: 'Lisa Wang', email: 'lwang@example.com', role: 'Instructor', status: 'Active', lastLogin: '2025-04-10 13:10' },
    { id: 7, name: 'Robert Smith', email: 'rsmith@example.com', role: 'Employer', status: 'Active', lastLogin: '2025-04-09 11:25' },
    { id: 8, name: 'Jessica Lee', email: 'jlee@example.com', role: 'Participant', status: 'Inactive', lastLogin: '2025-03-25 15:30' },
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active'
  });
  
  const roles = ['Admin', 'Instructor', 'Employer', 'Participant'];
  const statuses = ['Active', 'Inactive'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const openAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      status: 'Active'
    });
    setEditMode(false);
    setOpen(true);
  };
  
  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditMode(true);
    setOpen(true);
  };
  
  const handleDelete = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== id));
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been deleted from the system.`
      });
      
      logActivity(
        'User deleted',
        `${userToDelete.name} was deleted from the system`,
        'delete'
      );
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && currentUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === currentUser.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              status: formData.status
            }
          : user
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: "User Updated",
        description: `${formData.name}'s information has been updated.`
      });
      
      logActivity(
        'User updated',
        `${formData.name}'s user profile was updated`,
        'update'
      );
    } else {
      // Check if user with the same email exists
      const emailExists = users.some(
        user => user.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      if (emailExists) {
        toast({
          title: "User Exists",
          description: `A user with the email ${formData.email} already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      // Get current date and time for last login
      const now = new Date();
      const lastLogin = now.toISOString().split('T')[0] + ' ' + 
                        now.toTimeString().split(' ')[0].substring(0, 5);
      
      // Create new user
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        lastLogin: lastLogin
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "User Created",
        description: `${formData.name} has been added as a new ${formData.role}.`
      });
      
      logActivity(
        'User added',
        `${formData.name} was added as a new ${formData.role}`,
        'create'
      );
    }
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      role: '',
      status: 'Active'
    });
    setCurrentUser(null);
    setOpen(false);
  };

  // Apply filters to users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoleFilter = 
      roleFilter === '' || 
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
    const matchesStatusFilter = 
      statusFilter === '' || 
      user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white" onClick={openAddDialog}>
              <UserPlus size={18} className="mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? 'Update the user information below.' 
                  : 'Fill in the details to create a new user.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Enter full name" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="Enter email address" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('role', value)}
                  value={formData.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {editMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('status', value)}
                    value={formData.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  {editMode ? 'Update User' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search users..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={roleFilter} 
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role.toLowerCase()}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status.toLowerCase()}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' ? 'bg-admin bg-opacity-10 text-admin' : 
                    user.role === 'Instructor' ? 'bg-instructor bg-opacity-10 text-instructor' : 
                    user.role === 'Employer' ? 'bg-employer bg-opacity-10 text-employer' : 
                    'bg-participant bg-opacity-10 text-participant'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center gap-2 text-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
