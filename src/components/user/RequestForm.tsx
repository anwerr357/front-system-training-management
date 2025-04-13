
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRequests } from "@/contexts/RequestsContext";
import { useAuth } from "@/contexts/AuthContext";

const RequestForm: React.FC = () => {
  const { toast } = useToast();
  const { addRequest } = useRequests();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
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
    
    addRequest({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      title: formData.title,
      description: formData.description,
      type: formData.type as 'training' | 'certificate' | 'support' | 'other',
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: '',
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
            <Label htmlFor="title">Request Title</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Enter a title for your request"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training Request</SelectItem>
                <SelectItem value="certificate">Certificate Request</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
