
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useEmployers } from '@/hooks/useEmployers';
import { Building2, User, MapPin, Mail, Briefcase } from 'lucide-react';
import { Instructor } from '@/hooks/useInstructors';

interface EmployerDetailsDialogProps {
  employerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployerDetailsDialog: React.FC<EmployerDetailsDialogProps> = ({ 
  employerId, 
  open, 
  onOpenChange 
}) => {
  const { getEmployer, getEmployerInstructors } = useEmployers();
  
  const employerQuery = getEmployer(employerId || 0);
  const instructorsQuery = getEmployerInstructors(employerId || 0);
  
  const employer = employerQuery.data;
  const instructors = instructorsQuery.data || [];
  
  const isLoading = employerQuery.isLoading || instructorsQuery.isLoading;
  const error = employerQuery.error || instructorsQuery.error;

  if (!employerId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Employer Details</DialogTitle>
          <DialogDescription>
            View information about this employer and their instructors.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && <div className="py-4 text-center">Loading details...</div>}
        
        {error && (
          <div className="py-4 text-center text-red-500">
            Error loading employer details. Please try again.
          </div>
        )}
        
        {employer && !isLoading && !error && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                <h3 className="text-lg font-semibold">{employer.employerName}</h3>
              </div>
              
              {employer.userId && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>User ID: {employer.userId}</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Instructors ({instructors.length})</h3>
              {instructors.length === 0 ? (
                <p className="text-sm text-gray-500">No instructors associated with this employer.</p>
              ) : (
                <div className="space-y-2">
                  {instructors.map((instructor: Instructor) => (
                    <Card key={instructor.id} className="bg-gray-50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">{instructor.name}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Mail className="h-3 w-3 inline mr-1" />
                            {instructor.email}
                          </div>
                        </div>
                        {instructor.specialization && (
                          <div className="mt-1 text-sm">
                            <Briefcase className="h-3 w-3 inline mr-1 text-gray-500" />
                            {instructor.specialization}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployerDetailsDialog;
