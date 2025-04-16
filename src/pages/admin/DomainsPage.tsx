
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useDomains } from '@/hooks/useDomains';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Edit2, Trash2 } from 'lucide-react';
import { DomainFormData } from '@/types/domain';

const domainSchema = z.object({
  title: z.string().min(1, "Domain title is required")
});

const DomainsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDomain, setEditingDomain] = useState<number | null>(null);
  
  const { 
    domains, 
    createDomain, 
    updateDomain, 
    deleteDomain, 
    isLoading 
  } = useDomains();

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: { title: "" }
  });

  const onSubmit = (values: z.infer<typeof domainSchema>) => {
    if (editingDomain) {
      updateDomain({ id: editingDomain, data: values as DomainFormData });
    } else {
      createDomain(values as DomainFormData);
    }
    form.reset({ title: "" });
    setOpen(false);
    setEditingDomain(null);
  };

  const handleEdit = (id: number, title: string) => {
    setEditingDomain(id);
    form.reset({ title });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteDomain(id);
  };

  const filteredDomains = domains.data?.filter(domain => 
    domain.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (domains.error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">
          Error loading domains. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Domains</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-admin text-white"
              onClick={() => {
                setEditingDomain(null);
                form.reset({ title: "" });
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDomain ? 'Edit Domain' : 'Add New Domain'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter domain title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="bg-admin text-white">
                    {editingDomain ? 'Update Domain' : 'Create Domain'}
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
          placeholder="Search domains..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-6">Loading domains...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map(domain => (
            <Card key={domain.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">{domain.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(domain.id, domain.title)}
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
                        <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this domain? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(domain.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
            </Card>
          ))}
          {filteredDomains.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-6 text-gray-500">
              No domains found. {searchTerm ? 'Try adjusting your search.' : 'Create your first domain!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainsPage;
