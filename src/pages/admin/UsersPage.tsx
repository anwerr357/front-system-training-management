
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserPlus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-04-10 09:45' },
    { id: 2, name: 'Sarah Miller', email: 's.miller@example.com', role: 'Instructor', status: 'Active', lastLogin: '2023-04-11 14:30' },
    { id: 3, name: 'James Wilson', email: 'jwilson@example.com', role: 'Employer', status: 'Inactive', lastLogin: '2023-03-28 10:15' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Participant', status: 'Active', lastLogin: '2023-04-12 08:20' },
    { id: 5, name: 'Michael Brown', email: 'mbrown@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-04-11 16:45' },
    { id: 6, name: 'Lisa Wang', email: 'lwang@example.com', role: 'Instructor', status: 'Active', lastLogin: '2023-04-10 13:10' },
    { id: 7, name: 'Robert Smith', email: 'rsmith@example.com', role: 'Employer', status: 'Active', lastLogin: '2023-04-09 11:25' },
    { id: 8, name: 'Jessica Lee', email: 'jlee@example.com', role: 'Participant', status: 'Inactive', lastLogin: '2023-03-25 15:30' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <UserPlus size={18} />
              Add User
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select id="role" className="w-full p-2 border rounded-md">
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                  <option value="employer">Employer</option>
                  <option value="participant">Participant</option>
                </select>
              </div>
              <button className="w-full bg-admin text-white py-2 rounded-md mt-4">
                Create User
              </button>
            </div>
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
          <select className="border rounded-md px-2 py-1 text-sm">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="employer">Employer</option>
            <option value="participant">Participant</option>
          </select>
          
          <select className="border rounded-md px-2 py-1 text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
                      <button className="p-1 rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-600">
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
