
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTrainings } from '@/hooks/useTrainings';
import { Plus, Search, Calendar, Users, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmployerTrainingsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch trainings from API
  const { data: trainings = [], isLoading, error } = useTrainings();
  
  // Filter trainings based on search term
  const filteredTrainings = trainings.filter(
    training => 
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (training.description && training.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show error toast if fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching trainings",
        description: "There was a problem loading the training data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">Manage your organization's training programs</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-employer">
          <Plus className="h-4 w-4 mr-2" />
          Add New Training
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trainings..."
          className="pl-8 w-full md:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        // Loading state with skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-2" />
                <div className="flex items-center mt-4">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center mt-2">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        // Error state
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-red-600 font-medium">Unable to load training data</p>
              <p className="text-red-500 mt-2">Please try refreshing the page</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredTrainings.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trainings found with your search criteria.</p>
          {searchTerm && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        // Display trainings in a grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">{training.title}</CardTitle>
                <CardDescription>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    training.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : training.status === 'Completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {training.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {training.description || "No description available"}
                </p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {training.enrolledCount !== undefined && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{training.enrolledCount} enrolled</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(training.startDate) > new Date() 
                        ? `Starts in ${Math.ceil((new Date(training.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` 
                        : new Date(training.endDate) < new Date()
                        ? 'Completed'
                        : 'In progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerTrainingsPage;
