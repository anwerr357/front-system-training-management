import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers3, PieChart, Users, BadgeCheck, Clock, BookOpen, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from '@/utils/activityUtils';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const domainSchema = z.object({
  title: z.string().min(1, "Domain title is required")
});

const DomainsPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [domains, setDomains] = useState([
    {
      id: 1,
      name: 'Web Development',
      icon: <Layers3 className="h-5 w-5 text-blue-600" />,
      description: 'Frontend and backend technologies for building web applications.',
      profiles: 4,
      trainings: 12,
      participants: 145,
      averageRating: 4.7,
      completionRate: 82,
      status: 'Active',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      name: 'Data Science',
      icon: <PieChart className="h-5 w-5 text-green-600" />,
      description: 'Python, statistics, and machine learning for data analysis.',
      profiles: 3,
      trainings: 8,
      participants: 87,
      averageRating: 4.5,
      completionRate: 76,
      status: 'Active',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      name: 'UI/UX Design',
      icon: <BadgeCheck className="h-5 w-5 text-purple-600" />,
      description: 'User interface and experience design principles and tools.',
      profiles: 2,
      trainings: 6,
      participants: 64,
      averageRating: 4.8,
      completionRate: 91,
      status: 'Active',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      name: 'Digital Marketing',
      icon: <Users className="h-5 w-5 text-yellow-600" />,
      description: 'SEO, social media, and content strategies for digital marketing.',
      profiles: 2,
      trainings: 5,
      participants: 52,
      averageRating: 4.4,
      completionRate: 88,
      status: 'Active',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      name: 'Cloud Computing',
      icon: <Layers3 className="h-5 w-5 text-indigo-600" />,
      description: 'AWS, Azure, and Google Cloud Platform for cloud solutions.',
      profiles: 2,
      trainings: 7,
      participants: 73,
      averageRating: 4.6,
      completionRate: 79,
      status: 'Active',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 6,
      name: 'Project Management',
      icon: <Clock className="h-5 w-5 text-red-600" />,
      description: 'Methodologies and tools for effective project management.',
      profiles: 1,
      trainings: 4,
      participants: 38,
      averageRating: 4.3,
      completionRate: 85,
      status: 'Active',
      color: 'bg-red-100 text-red-800'
    }
  ]);
  
  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      title: ""
    }
  });
  
  const onSubmit = (values: z.infer<typeof domainSchema>) => {
    const titleExists = domains.some(
      domain => domain.name.toLowerCase() === values.title.toLowerCase()
    );
    
    if (titleExists) {
      toast({
        title: "Domain Exists",
        description: `A domain with the title "${values.title}" already exists.`,
        variant: "destructive"
      });
      return;
    }
    
    const newDomain = {
      id: domains.length > 0 ? Math.max(...domains.map(d => d.id)) + 1 : 1,
      name: values.title,
      icon: <Layers3 className="h-5 w-5 text-indigo-600" />,
      description: '',
      profiles: 0,
      trainings: 0,
      participants: 0,
      averageRating: 0,
      completionRate: 0,
      status: 'Active',
      color: 'bg-indigo-100 text-indigo-800'
    };
    
    setDomains([...domains, newDomain]);
    
    toast({
      title: "Domain Created",
      description: `${values.title} has been added as a new domain.`
    });
    
    logActivity(
      'Domain added',
      `${values.title} was added as a new domain`,
      'create'
    );
    
    form.reset();
    setOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Domains</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin text-white flex items-center gap-2">
              <Plus size={18} />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter domain title" 
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
                    Create Domain
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map(domain => (
              <Card key={domain.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {domain.icon}
                    {domain.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{domain.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                      <BookOpen className="h-5 w-5 text-admin mb-1" />
                      <div className="font-bold">{domain.trainings}</div>
                      <div className="text-xs text-gray-500">Trainings</div>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-admin mb-1" />
                      <div className="font-bold">{domain.participants}</div>
                      <div className="text-xs text-gray-500">Participants</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{domain.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${domain.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <span className="text-amber-500 text-sm font-medium">{domain.averageRating}</span>
                        <div className="flex ml-1">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(domain.averageRating) ? 'text-amber-500' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${domain.color}`}>
                      {domain.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participants by Domain</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Participants Distribution Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completion Rates</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Completion Rates Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Domain Growth (6 Months)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Domain Growth Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Ratings</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Ratings Comparison Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainsPage;
