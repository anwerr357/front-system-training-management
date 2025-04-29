
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Training, TrainingFormData } from '@/types/training';
import { Loader2 } from 'lucide-react';

interface TrainingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TrainingFormData) => Promise<void>;
  training?: Training;
  domains: any[];
  instructors: any[];
  isLoading?: boolean;
}

const TrainingFormDialog: React.FC<TrainingFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  training,
  domains,
  instructors,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TrainingFormData>({
    title: '',
    description: '',
    year: 2025,
    startTime: '09:00',
    duration: 8,
    domainId: 0,
    instructorId: 0,
    budget: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {

  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save training. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{training ? 'Edit Training' : 'Add New Training'}</DialogTitle>
          <DialogDescription>
            {training ? 'Update training information below.' : 'Create a new training program.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min={1}
              max={30}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Select
              value={formData.domainId.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, domainId: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id.toString()}>
                    {domain.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Select
              value={formData.instructorId.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, instructorId: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id.toString()}>
                    {instructor.firstName} {instructor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              min={0}
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || isLoading}
              className="bg-primary"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {training ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                training ? 'Update Training' : 'Create Training'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingFormDialog;
