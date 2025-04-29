
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Structure type definition
interface Structure {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(1, "Structure title is required"),
  description: z.string().optional()
});

const StructuresPage: React.FC = () => {
  const { toast } = useToast();
  const [structures, setStructures] = useState<Structure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
  
  // Create form
  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  });
  
  // Update form
  const updateForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  });
  
  // Fetch all structures
  const fetchStructures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/structures');
      setStructures(response.data);
    } catch (err) {
      console.error('Error fetching structures:', err);
      setError('Failed to load structures. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load structures. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch structure details
  const fetchStructureDetails = async (id: number) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/structures/${id}`);
      setSelectedStructure(response.data);
      setIsViewDialogOpen(true);
    } catch (err) {
      console.error('Error fetching structure details:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load structure details. Please try again later."
      });
    } finally {
      setDetailsLoading(false);
    }
  };
  
  // Create structure
  const handleCreateStructure = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        title: values.title,
        description: values.description || ""
      };
      
      const response = await axios.post('http://localhost:8080/api/structures', payload);
      
      const now = new Date().toISOString();
      const newStructure: Structure = {
        ...response.data,
        createdAt: now,
        updatedAt: now
      };
      
      setStructures([...structures, newStructure]);
      
      toast({
        title: "Success",
        description: "Structure has been created successfully."
      });
      
      logActivity(
        'Structure created',
        `${values.title} was created successfully`,
        'create'
      );
      
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (err) {
      console.error('Error creating structure:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create structure. Please try again later."
      });
    }
  };
  
  // Update structure
  const handleUpdateStructure = async (values: z.infer<typeof formSchema>) => {
    if (!selectedStructure) return;
    
    try {
      const payload = {
        title: values.title,
        description: values.description || ""
      };
      
      await axios.put(`http://localhost:8080/api/structures/${selectedStructure.id}`, payload);
      
      const updatedStructure: Structure = {
        ...selectedStructure,
        title: values.title,
        description: values.description,
        updatedAt: new Date().toISOString()
      };
      
      setStructures(structures.map(s => 
        s.id === selectedStructure.id ? updatedStructure : s
      ));
      
      toast({
        title: "Success",
        description: "Structure has been updated successfully."
      });
      
      logActivity(
        'Structure updated',
        `${values.title} was updated successfully`,
        'update'
      );
      
      setIsUpdateDialogOpen(false);
      setSelectedStructure(null);
      updateForm.reset();
    } catch (err) {
      console.error('Error updating structure:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update structure. Please try again later."
      });
    }
  };
  
  // Delete structure
  const handleDeleteStructure = async () => {
    console.log(selectedStructure);
    if (!selectedStructure) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/structures/${selectedStructure.id}`);
      
      setStructures(structures.filter(s => s.id !== selectedStructure.id));
      
      toast({
        title: "Success",
        description: "Structure has been deleted successfully."
      });
      
      logActivity(
        'Structure deleted',
        `${selectedStructure.title} was deleted successfully`,
        'delete'
      );
      
      setIsDeleteDialogOpen(false);
      setSelectedStructure(null);
    } catch (err) {
      console.error('Error deleting structure:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete structure. Please try again later."
      });
    }
  };
  
  // Open create dialog
  const openCreateDialog = () => {
    createForm.reset();
    setIsCreateDialogOpen(true);
  };
  
  // Open update dialog
  const openUpdateDialog = (structure: Structure) => {
    setSelectedStructure(structure);
    updateForm.reset({
      title: structure.title,
      description: structure.description || ""
    });
    setIsUpdateDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (structure: Structure) => {
    setSelectedStructure(structure);
    setIsDeleteDialogOpen(true);
  };
  
  // Load structures on component mount
  useEffect(() => {
    fetchStructures();
  }, []);
  
  // Filter structures based on search term
  const filteredStructures = structures.filter(
    structure => structure.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Structures</h1>
        <Button className="bg-admin text-white" onClick={openCreateDialog}>
          <Plus size={18} className="mr-2" />
          Add Structure
        </Button>
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
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-admin" />
          <span className="ml-2 text-lg">Loading structures...</span>
        </div>
      ) : (
        /* Data table */
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStructures.length > 0 ? (
                filteredStructures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium">{structure.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(structure.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(structure.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            onClick={() => fetchStructureDetails(structure.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2"
                            onClick={() => openUpdateDialog(structure)}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 text-red-600"
                            onClick={() => openDeleteDialog(structure)}
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
                    {searchTerm ? 
                      "No structures found matching your search. Try a different term." :
                      "No structures found. Click 'Add Structure' to create your first structure."
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Create Structure Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Structure</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new structure.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateStructure)} className="space-y-4 py-2">
              <FormField
                control={createForm.control}
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
              
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  Create Structure
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Update Structure Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Structure</DialogTitle>
            <DialogDescription>
              Update the structure information below.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateStructure)} className="space-y-4 py-2">
              <FormField
                control={updateForm.control}
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
              
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin text-white">
                  Update Structure
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Structure Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Structure Details</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-admin" />
              <span className="ml-2">Loading details...</span>
            </div>
          ) : selectedStructure ? (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium leading-none">Title</h3>
                <p className="mt-1 text-base">{selectedStructure.title}</p>
              </div>
              {selectedStructure.description && (
                <div>
                  <h3 className="text-sm font-medium leading-none">Description</h3>
                  <p className="mt-1 text-base">{selectedStructure.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium leading-none">Created</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(selectedStructure.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium leading-none">Last Updated</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(selectedStructure.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No details available</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedStructure?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() =>  setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteStructure}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StructuresPage;
