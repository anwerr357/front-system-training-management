
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployerFormData } from "@/types/employer";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/employer";
import axios from 'axios';

interface EmployerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EmployerFormData) => void;
  employer: any | null;
  isLoading: boolean;
  eligibleUsers?: User[];
}

const EmployerFormDialog: React.FC<EmployerFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  employer,
  isLoading,
  eligibleUsers
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employerName: employer?.employerName || '',
    email: '',
    password: '',
    role: 'Employer' // Default role is Employer
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!employer) {
        // Create user first if this is a new employer
        const userResponse = await axios.post('http://localhost:8080/api/users', {
          name: formData.employerName,
          login: formData.email,
          password: formData.password,
          roleId: 3 // Assuming 3 is the ID for the Employer role
        });
        
        if (userResponse.data && userResponse.data.id) {
          // Now create the employer with the user ID
          onSubmit({ 
            employerName: formData.employerName,
            userId: userResponse.data.id
          });
        }
      } else {
        // Just update the employer name for existing employers
        onSubmit({ employerName: formData.employerName });
      }
    } catch (error) {
      console.error('Error creating user for employer:', error);
      toast({
        title: "Error",
        description: "Failed to create user account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employer ? "Edit Employer" : "Add New Employer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employerName">Employer Name</Label>
            <Input
              id="employerName"
              name="employerName"
              value={formData.employerName}
              onChange={handleInputChange}
              placeholder="Enter employer name"
              required
            />
          </div>
          
          {!employer && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-admin"
            >
              {employer ? "Update Employer" : "Add Employer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerFormDialog;
