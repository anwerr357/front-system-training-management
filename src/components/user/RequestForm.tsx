
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRequests } from "@/contexts/RequestsContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock trainings data - in a real app, this would come from an API or context
const availableTrainings = [
  { id: 'WD101', name: 'Web Development Fundamentals' },
  { id: 'JS201', name: 'Advanced JavaScript' },
  { id: 'DS101', name: 'Data Science Basics' },
  { id: 'ML201', name: 'Machine Learning' },
  { id: 'UX101', name: 'UX/UI Design Principles' },
];

const RequestForm: React.FC = () => {
  const { toast } = useToast();
  const { addRequest } = useRequests();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    trainingId: '',
    message: '', // Added additional message field
  });
  
  const [showTrainingSelect, setShowTrainingSelect] = useState(false);
  
  // Update UI based on request type
  useEffect(() => {
    setShowTrainingSelect(formData.type === 'enrollment');
    
    // If switching to enrollment, update title based on selected training
    if (formData.type === 'enrollment' && formData.trainingId) {
      const training = availableTrainings.find(t => t.id === formData.trainingId);
      if (training) {
        setFormData(prev => ({
          ...prev,
          title: `Enrollment: ${training.name}`
        }));
      }
    }
  }, [formData.type, formData.trainingId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If selecting a training course, automatically update the title
    if (name === 'trainingId') {
      const training = availableTrainings.find(t => t.id === value);
      if (training) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          title: `Enrollment: ${training.name}`
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.title || !formData.description || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.type === 'enrollment' && !formData.trainingId) {
      toast({
        title: "Error",
        description: "Please select a training course.",
        variant: "destructive"
      });
      return;
    }
    
    const requestData: any = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      title: formData.title,
      description: formData.description,
      type: formData.type as 'training' | 'certificate' | 'support' | 'enrollment' | 'other',
      message: formData.message, // Include additional message if provided
    };
    
    // Add training details for enrollment requests
    if (formData.type === 'enrollment' && formData.trainingId) {
      const training = availableTrainings.find(t => t.id === formData.trainingId);
      requestData.trainingId = formData.trainingId;
      requestData.trainingName = training?.name;
    }
    
    addRequest(requestData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: '',
      trainingId: '',
      message: '', // Reset message field
    });
    
    toast({
      title: "Request Submitted",
      description: "Your request has been submitted successfully.",
    });
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Submit a Request</CardTitle>
        <CardDescription>
          Fill out the form to submit a new request to the administrators.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollment">Course Enrollment</SelectItem>
                <SelectItem value="training">Training Request</SelectItem>
                <SelectItem value="certificate">Certificate Request</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showTrainingSelect && (
            <div className="space-y-2">
              <Label htmlFor="trainingId">Select Training Course</Label>
              <Select 
                value={formData.trainingId} 
                onValueChange={(value) => handleSelectChange('trainingId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a training course" />
                </SelectTrigger>
                <SelectContent>
                  {availableTrainings.map(training => (
                    <SelectItem key={training.id} value={training.id}>{training.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Request Title</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Enter a title for your request"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={formData.type === 'enrollment'}
            />
            {formData.type === 'enrollment' && (
              <p className="text-xs text-muted-foreground">Title is automatically generated for course enrollments</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Please provide details about your request"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-32"
              required
            />
          </div>
          
          {formData.type === 'enrollment' && (
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Add any additional information for the administrators"
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-20"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="participant" className="w-full">
            Submit Request
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RequestForm;
