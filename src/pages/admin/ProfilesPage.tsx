
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfiles } from '@/hooks/useProfiles';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProfileFormData } from '@/types/profile';

const formSchema = z.object({
  title: z.string().min(1, "Profile title is required")
});

const ProfilesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProfile, setEditingProfile] = useState<number | null>(null);
  
  const { 
    profiles, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    isLoading 
  } = useProfiles();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingProfile) {
      updateProfile({ id: editingProfile, data: values as ProfileFormData });
    } else {
      createProfile(values as ProfileFormData);
    }
    form.reset({ title: "" });
    setOpen(false);
    setEditingProfile(null);
  };

  const handleEdit = (id: number, title: string) => {
    setEditingProfile(id);
    form.reset({ title });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteProfile(id);
  };

  const filteredProfiles = profiles.data?.filter(profile => 
    profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (profiles.error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">
          Error loading profiles. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-admin text-white"
              onClick={() => {
                setEditingProfile(null);
                form.reset({ title: "" });
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit Profile' : 'Add New Profile'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter profile title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="bg-admin text-white">
                    {editingProfile ? 'Update Profile' : 'Create Profile'}
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

      {isLoading ? (
        <div className="text-center py-6">Loading profiles...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.title}</TableCell>
                    <TableCell className="w-[100px]">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(profile.id, profile.title)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this profile? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(profile.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6 text-gray-500">
                    No profiles found. {searchTerm ? 'Try adjusting your search.' : 'Create your first profile!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;
