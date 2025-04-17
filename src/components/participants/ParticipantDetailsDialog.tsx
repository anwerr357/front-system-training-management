
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participant } from '@/hooks/useParticipants';
import { useParticipantTrainings } from '@/hooks/useParticipants';

interface ParticipantDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
}

const ParticipantDetailsDialog: React.FC<ParticipantDetailsDialogProps> = ({
  open,
  onOpenChange,
  participant
}) => {
  const { data: trainings, isLoading } = useParticipantTrainings(participant?.id || null);

  if (!participant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Participant Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-base">{participant.firstName} {participant.lastName}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-base">{participant.email}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-base">{participant.phone}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Trainings</h3>
            {isLoading ? (
              <p>Loading trainings...</p>
            ) : trainings && trainings.length > 0 ? (
              <ul className="space-y-2">
                {trainings.map(training => (
                  <li key={training.id} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{training.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(training.startDate).toLocaleDateString()} - 
                      {new Date(training.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">{training.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No trainings found</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantDetailsDialog;
