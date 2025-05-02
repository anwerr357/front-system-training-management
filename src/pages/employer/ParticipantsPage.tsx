import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParticipants, useParticipantActions, Participant, ParticipantFormData } from '@/hooks/useParticipants';
import { logActivity } from '@/utils/activityUtils';
import { Search, UserPlus, Edit, Trash, Eye } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ParticipantFormDialog from '@/components/participants/ParticipantFormDialog';
import ParticipantDetailsDialog from '@/components/participants/ParticipantDetailsDialog';

const ParticipantsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: participants, isLoading, error } = useParticipants();
  const { createParticipant, updateParticipant, deleteParticipant } = useParticipantActions();
  
// <<<<<<< HEAD
//   // Get instructor user IDs
//   const instructorUserIds = instructors?.map(instructor => instructor.id) || [];
//   // Get participant user IDs
//   const participantUserIds = participants?.map(participant => participant.id) || [];
  
// =======
// >>>>>>> 7fd6819e27fa8554ca278df57bfdd517f5657ac2
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Selected participant for operations
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  
  // Handle create participant
  const handleCreateParticipant = (data: ParticipantFormData) => {
    createParticipant.mutate(data, {
      onSuccess: (newParticipant) => {
        setCreateDialogOpen(false);
        toast({
          title: "Success",
          description: `Participant ${data.firstName} ${data.lastName} has been created.`,
        });

        // Log this activity
        logActivity(
          "Participant added",
          `${data.firstName} ${data.lastName} has been registered as a participant`,
          "create"
        );
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create participant. Please try again.",
          variant: "destructive",
        });
      },
    });
  };
  
  // Handle edit participant
  const handleEditParticipant = (data: ParticipantFormData) => {
    if (!selectedParticipant) return;

    updateParticipant.mutate(
      { id: selectedParticipant.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedParticipant(null);
          toast({
            title: "Success",
            description: `Participant ${data.firstName} ${data.lastName} has been updated.`,
          });

          // Log this activity
          logActivity(
            "Participant updated",
            `${data.firstName} ${data.lastName} information has been updated`,
            "update"
          );
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update participant. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };
  
  // Handle delete participant
  const handleDeleteParticipant = () => {
    if (!selectedParticipant) return;
    
    deleteParticipant.mutate(selectedParticipant.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        
        toast({
          title: "Success",
          description: `Participant ${selectedParticipant.firstName} ${selectedParticipant.lastName} has been deleted.`
        });
        
        // Log this activity
        logActivity(
          'Participant deleted',
          `${selectedParticipant.firstName} ${selectedParticipant.lastName} has been removed`,
          'delete'
        );
        
        setSelectedParticipant(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete participant. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Open edit dialog
  const openEditDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setEditDialogOpen(true);
  };
  
  // Open details dialog
  const openDetailsDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setDetailsDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setDeleteDialogOpen(true);
  };
  
  // Filter participants based on search term
  const filteredParticipants = participants?.filter(participant => 
    participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Participants</h1>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          Error loading participants: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Participants</h1>
        <Button 
          className="bg-admin text-white"
          onClick={() => setCreateDialogOpen(true)}
        >
          <UserPlus size={18} className="mr-2" />
          Add Participant
        </Button>
      </div>
      
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search participants..." 
          className="pl-8" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading participants...
                </TableCell>
              </TableRow>
            ) : filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No participants found
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.firstName} {participant.lastName}
                  </TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDetailsDialog(participant)}
                        title="View details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(participant)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(participant)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Create Participant Dialog */}
      <ParticipantFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateParticipant}
        title="Add New Participant"
      />
      
      {/* Edit Participant Dialog */}
      {selectedParticipant && (
        <ParticipantFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditParticipant}
          initialData={{
            firstName: selectedParticipant.firstName,
            lastName: selectedParticipant.lastName,
            email: selectedParticipant.email,
            phone: selectedParticipant.phone,
            structureId: selectedParticipant.structureId,
            profileId: selectedParticipant.profileId,
            trainingIds: selectedParticipant.trainingIds, // Updated to match the new structure
            password: '', // Leave empty for security reasons; user can input a new password
            role: selectedParticipant.role, // Use the existing role
          }}
          title="Edit Participant"
        />
      )}
      
      {/* View Participant Details Dialog */}
      <ParticipantDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        participant={selectedParticipant}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the participant 
              {selectedParticipant && ` ${selectedParticipant.firstName} ${selectedParticipant.lastName}`}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* Cancel button to close the dialog */}
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            {/* Delete button to confirm deletion */}
            <AlertDialogAction
              onClick={handleDeleteParticipant}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParticipantsPage;
