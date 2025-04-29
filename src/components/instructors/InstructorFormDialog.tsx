import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstructorFormData, Instructor } from '@/hooks/useInstructors';
import { Employer } from '@/types/employer';
import { User } from '@/types/employer';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface InstructorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstructorFormData) => void;
  instructor: Instructor | null;
  employers: Employer[];
  isLoading: boolean;
  users?: User[];
  instructorUserIds?: number[];
}

const InstructorFormDialog: React.FC<InstructorFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  instructor,
  employers,
  isLoading,
  users,
  instructorUserIds
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: instructor?.id ||'',
    firstName: instructor?.firstName || '',
    lastName: instructor?.lastName || '',
    email: instructor?.email || '',
    phone: instructor?.phone || '',
    type: instructor?.type || 'Full-Time',
    employerId: instructor?.employerId?.toString() || '',
    password: '',
    role: 'Instructor' // Default role is Instructor
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'none' ? undefined : value, // Convert 'none' to undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!instructor) {

        // Create user first if this is a new instructor
        // const userResponse = await axios.post('http://localhost:8080/api/instructors', {
        //   firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     email: formData.email,
        //     phone: formData.phone,
        //     type: formData.type,
        //     employerId: formData.employerId ? parseInt(formData.employerId) : undefined,
        //     password: formData.password, // Include the password field
        //     role: formData.role, // Include the role field
        // });
        
          // Now create the instructor with the user ID
          onSubmit({
            id: formData?.id ? parseInt(formData.id.toString(), 10) : undefined, // Ensure 'id' is a number or undefined
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            type: formData.type,
            employerId: formData.employerId ? parseInt(formData.employerId) : undefined,
            password: formData.password, // Include the password field
            role: formData.role, // Include the role field
          });
        
      } else {
        // Update existing instructor
        onSubmit({
          id: formData?.id ? parseInt(formData.id.toString(), 10) : undefined,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          type: formData.type,
          password: formData.password, // Include the password field
          role: formData.role, // Include the role field
          employerId: formData.employerId ? parseInt(formData.employerId) : undefined
        });
      }
    } catch (error) {
      console.error('Error creating user for instructor:', error);
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
            {instructor ? "Edit Instructor" : "Add New Instructor"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>

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
              disabled={!!instructor}
            />
          </div>

          {!instructor && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange('type', value)}
              value={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerId">Employer (Optional)</Label>
            <Select
              onValueChange={(value) => handleSelectChange('employerId', value === 'none' ? undefined : value)}
              value={formData.employerId || 'none'} // Use 'none' as the default value
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem> {/* Use 'none' instead of an empty string */}
                {employers.map((employer) => (
                  <SelectItem key={employer.id} value={employer.id.toString()}>
                    {employer.employerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              {instructor ? "Update Instructor" : "Add Instructor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorFormDialog;
