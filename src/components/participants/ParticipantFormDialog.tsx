
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from '@/hooks/useUsers';
import { useTrainings, useStructures, ParticipantFormData } from '@/hooks/useParticipants';
import { useProfiles } from '@/hooks/useProfiles';
import { User } from '@/types/employer';

interface ParticipantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ParticipantFormData) => void;
  initialData?: ParticipantFormData;
  title: string;
  instructorUserIds?: number[];
  participantUserIds?: number[];
}

const ParticipantFormDialog: React.FC<ParticipantFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  instructorUserIds = [],
  participantUserIds = []
}) => {
  const { toast } = useToast();
  const { users, eligibleUsers, isLoading: isLoadingUsers } = useUsers(instructorUserIds, participantUserIds);
  const { data: trainings, isLoading: isLoadingTrainings } = useTrainings();
  const { data: structures, isLoading: isLoadingStructures } = useStructures();
  const { profiles } = useProfiles();

  const [formData, setFormData] = useState<ParticipantFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    structureId: undefined,
    profileId: undefined,
    trainingId: undefined,
    userId: 0
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert numeric string values to numbers
    if (['userId', 'structureId', 'profileId', 'trainingId'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSelect = (userId: string) => {
    const selectedUserId = parseInt(userId);
    
    // Find the selected user to get their name and email
    const selectedUser = users.data?.find(user => user.id === selectedUserId);
    
    if (selectedUser) {
      // Split the name into first and last name
      const nameParts = selectedUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        userId: selectedUserId,
        firstName,
        lastName,
        email: selectedUser.email
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.userId || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  const isLoading = isLoadingUsers || isLoadingTrainings || isLoadingStructures || profiles.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details to {initialData ? 'update' : 'create'} a participant.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* User selection */}
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select 
              onValueChange={(value) => handleUserSelect(value)}
              value={formData.userId ? formData.userId.toString() : ''}
              disabled={!!initialData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {eligibleUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
            />
          </div>
          
          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
            />
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
            />
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
            />
          </div>
          
          {/* Structure selection */}
          <div className="space-y-2">
            <Label htmlFor="structure">Structure</Label>
            <Select 
              onValueChange={(value) => handleSelectChange('structureId', value)}
              value={formData.structureId?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a structure" />
              </SelectTrigger>
              <SelectContent>
                {structures?.map((structure) => (
                  <SelectItem key={structure.id} value={structure.id.toString()}>
                    {structure.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Profile selection */}
          <div className="space-y-2">
            <Label htmlFor="profile">Profile</Label>
            <Select 
              onValueChange={(value) => handleSelectChange('profileId', value)}
              value={formData.profileId?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.data?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id.toString()}>
                    {profile.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Training selection */}
          <div className="space-y-2">
            <Label htmlFor="training">Training</Label>
            <Select 
              onValueChange={(value) => handleSelectChange('trainingId', value)}
              value={formData.trainingId?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a training" />
              </SelectTrigger>
              <SelectContent>
                {trainings?.map((training) => (
                  <SelectItem key={training.id} value={training.id.toString()}>
                    {training.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-admin text-white">
              {initialData ? 'Update' : 'Create'} Participant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantFormDialog;
