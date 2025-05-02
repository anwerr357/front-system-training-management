import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployerFormData, User } from "@/types/employer";
import { useToast } from "@/hooks/use-toast";

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
    role: employer?.role || 'employer' // Default role is 'employer'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (employer) {
      // Editing existing employer
      onSubmit({
        employerName: formData.employerName || employer.employerName,
        email: formData.email || employer.email,
        password: formData.password || employer.password,
        role: formData.role || employer.role,
        id: employer.id
      });
    } else {
      // Adding new employer
      onSubmit({
        employerName: formData.employerName,
        email: formData.email,
        password: formData.password,
        role: formData.role
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

          {/* Role Selection Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="employer">responsible</option>
              <option value="user">User</option>
            </select>
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
              {employer ? "Update Employer" : "Add Employer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerFormDialog;
