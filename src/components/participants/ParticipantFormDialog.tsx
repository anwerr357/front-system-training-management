import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTrainings, useStructures, ParticipantFormData } from '@/hooks/useParticipants';
import { useProfiles } from '@/hooks/useProfiles';

interface ParticipantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ParticipantFormData) => void;
  initialData?: ParticipantFormData;
  title: string;
}

const ParticipantFormDialog: React.FC<ParticipantFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) => {
  const { toast } = useToast();
  const { data: trainings, isLoading: isLoadingTrainings } = useTrainings();
  const { data: structures, isLoading: isLoadingStructures } = useStructures();
  const { profiles } = useProfiles();

  const [formData, setFormData] = useState<ParticipantFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    structureId: undefined,
    profileId: undefined,
    trainingIds: [],
    role: 'participant', // Default role
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number | number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrainingSelect = (trainingId: string) => {
    const id = parseInt(trainingId, 10);
    setFormData((prev) => ({
      ...prev,
      trainingIds: prev.trainingIds.includes(id)
        ? prev.trainingIds.filter((tid) => tid !== id) // Remove if already selected
        : [...prev.trainingIds, id], // Add if not selected
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  const isLoading = isLoadingTrainings || isLoadingStructures || profiles.isLoading;

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
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
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
              required
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
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
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
              required
            />
          </div>

          {/* Structure selection */}
          <div className="space-y-2">
            <Label htmlFor="structure">Structure</Label>
            <Select
              onValueChange={(value) => handleSelectChange('structureId', parseInt(value, 10))}
              value={formData.structureId?.toString() || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a structure" />
              </SelectTrigger>
              <SelectContent>
                {structures?.map((structure) => (
                  <SelectItem key={structure.id} value={structure.id.toString()}>
                    {structure.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profile selection */}
          <div className="space-y-2">
            <Label htmlFor="profile">Profile</Label>
            <Select
              onValueChange={(value) => handleSelectChange('profileId', parseInt(value, 10))}
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
            <Label htmlFor="training">Trainings</Label>
            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {trainings?.map((training) => (
                <div key={training.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`training-${training.id}`}
                    value={training.id}
                    checked={formData.trainingIds.includes(training.id)}
                    onChange={(e) => handleTrainingSelect(e.target.value)}
                    className="checkbox"
                  />
                  <Label htmlFor={`training-${training.id}`}>{training.title}</Label>
                </div>
              ))}
            </div>
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
