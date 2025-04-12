
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Plus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Profile {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Profile title is required")
});

const ProfilesPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  
  const [profiles, setProfiles] = useState<Profile[]>([
    { 
      id: 1, 
      title: 'Software Developer', 
      createdAt: '2025-03-15 10:00', 
      updatedAt: '2025-03-15 10:00' 
    },
    { 
      id: 2, 
      title: 'UX/UI Designer', 
      createdAt: '2025-03-16 11:30', 
      updatedAt: '2025-03-16 11:30' 
    },
    { 
      id: 3, 
      title: 'Project Manager', 
      createdAt: '2025-03-17 09:15', 
      updatedAt: '2025-03-17 09:15' 
    },
    { 
      id: 4, 
      title: 'Data Analyst', 
      createdAt: '2025-03-18 14:45', 
      updatedAt: '2025-03-18 14:45' 
    },
  ]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  });
  
  const openAddDialog = () => {
    form.reset({ title: "" });
    setEditMode(false);
    setOpen(true);
  };
  
  const openEditDialog = (profile: Profile) => {
    setCurrentProfile(profile);
    form.reset({ title: profile.title });
    setEditMode(true);
    setOpen(true);
  };
  
  const handleDelete = (id: number) => {
    const profileToDelete = profiles.find(p => p.id === id);
    
    if (profileToDelete) {
      setProfiles(profiles.filter(profile => profile.id !== id));
      
      toast({
        title: "Profile Deleted",
        description: `${profileToDelete.title} has been deleted.`
      });
      
      logActivity(
        'Profile deleted',
        `${profileToDelete.title} was deleted from the system`,
        'delete'
      );
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0].substring(0, 5);
    
    if (editMode && currentProfile) {
      // Update existing profile
      const updatedProfiles = profiles.map(profile => 
        profile.id === currentProfile.id
          ? {
              ...profile,
              title: values.title,
              updatedAt: timestamp
            }
          : profile
      );
      
      setProfiles(updatedProfiles);
      
      toast({
        title: "Profile Updated",
        description: `${values.title} has been updated.`
      });
      
      logActivity(
        'Profile updated',
        `${values.title} profile was updated`,
        'update'
      );
    } else {
      // Check if profile with the same title exists
      const titleExists = profiles.some(
        profile => profile.title.toLowerCase() === values.title.toLowerCase()
      );
      
      if (titleExists) {
        toast({
          title: "Profile Exists",
          description: `A profile with the title "${values.title}" already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      // Create new profile
      const newProfile: Profile = {
        id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1,
        title: values.title,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      setProfiles([...profiles, newProfile]);
      
      toast({
        title: "Profile Created",
        description: `${values.title} has been added as a new profile.`
      });
      
      logActivity(
        'Profile added',
        `${values.title} was added as a new profile`,
        'create'
      );
    }
    
    // Reset form and close dialog
    form.reset();
    setCurrentProfile(null);
    setOpen(false);
  };

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(
    profile => profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white" onClick={openAddDialog}>
              <Plus size={18} className="mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Profile' : 'Add New Profile'}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? 'Update the profile information below.' 
                  : 'Fill in the details to create a new profile.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter profile title" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-admin text-white">
                    {editMode ? 'Update Profile' : 'Create Profile'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search profiles..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.title}</TableCell>
                  <TableCell className="text-sm text-gray-500">{profile.createdAt}</TableCell>
                  <TableCell className="text-sm text-gray-500">{profile.updatedAt}</TableCell>
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
                          onClick={() => openEditDialog(profile)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer flex items-center gap-2 text-red-600"
                          onClick={() => handleDelete(profile.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  No profiles found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProfilesPage;
