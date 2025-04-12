
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

interface Structure {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Structure title is required")
});

const StructuresPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStructure, setCurrentStructure] = useState<Structure | null>(null);
  
  const [structures, setStructures] = useState<Structure[]>([
    { 
      id: 1, 
      title: 'IT Department', 
      createdAt: '2025-03-15 10:00', 
      updatedAt: '2025-03-15 10:00' 
    },
    { 
      id: 2, 
      title: 'HR Department', 
      createdAt: '2025-03-16 11:30', 
      updatedAt: '2025-03-16 11:30' 
    },
    { 
      id: 3, 
      title: 'Marketing Department', 
      createdAt: '2025-03-17 09:15', 
      updatedAt: '2025-03-17 09:15' 
    },
    { 
      id: 4, 
      title: 'Finance Department', 
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
  
  const openEditDialog = (structure: Structure) => {
    setCurrentStructure(structure);
    form.reset({ title: structure.title });
    setEditMode(true);
    setOpen(true);
  };
  
  const handleDelete = (id: number) => {
    const structureToDelete = structures.find(s => s.id === id);
    
    if (structureToDelete) {
      setStructures(structures.filter(structure => structure.id !== id));
      
      toast({
        title: "Structure Deleted",
        description: `${structureToDelete.title} has been deleted.`
      });
      
      logActivity(
        'Structure deleted',
        `${structureToDelete.title} was deleted from the system`,
        'delete'
      );
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0].substring(0, 5);
    
    if (editMode && currentStructure) {
      // Update existing structure
      const updatedStructures = structures.map(structure => 
        structure.id === currentStructure.id
          ? {
              ...structure,
              title: values.title,
              updatedAt: timestamp
            }
          : structure
      );
      
      setStructures(updatedStructures);
      
      toast({
        title: "Structure Updated",
        description: `${values.title} has been updated.`
      });
      
      logActivity(
        'Structure updated',
        `${values.title} structure was updated`,
        'update'
      );
    } else {
      // Check if structure with the same title exists
      const titleExists = structures.some(
        structure => structure.title.toLowerCase() === values.title.toLowerCase()
      );
      
      if (titleExists) {
        toast({
          title: "Structure Exists",
          description: `A structure with the title "${values.title}" already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      // Create new structure
      const newStructure: Structure = {
        id: structures.length > 0 ? Math.max(...structures.map(s => s.id)) + 1 : 1,
        title: values.title,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      setStructures([...structures, newStructure]);
      
      toast({
        title: "Structure Created",
        description: `${values.title} has been added as a new structure.`
      });
      
      logActivity(
        'Structure added',
        `${values.title} was added as a new structure`,
        'create'
      );
    }
    
    // Reset form and close dialog
    form.reset();
    setCurrentStructure(null);
    setOpen(false);
  };

  // Filter structures based on search term
  const filteredStructures = structures.filter(
    structure => structure.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Structures</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white" onClick={openAddDialog}>
              <Plus size={18} className="mr-2" />
              Add Structure
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Structure' : 'Add New Structure'}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? 'Update the structure information below.' 
                  : 'Fill in the details to create a new structure.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Structure Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter structure title" 
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
                    {editMode ? 'Update Structure' : 'Create Structure'}
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
          placeholder="Search structures..." 
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
            {filteredStructures.length > 0 ? (
              filteredStructures.map((structure) => (
                <TableRow key={structure.id}>
                  <TableCell className="font-medium">{structure.title}</TableCell>
                  <TableCell className="text-sm text-gray-500">{structure.createdAt}</TableCell>
                  <TableCell className="text-sm text-gray-500">{structure.updatedAt}</TableCell>
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
                          onClick={() => openEditDialog(structure)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer flex items-center gap-2 text-red-600"
                          onClick={() => handleDelete(structure.id)}
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
                  No structures found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StructuresPage;
