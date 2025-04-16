
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Employer, User, EmployerFormData } from '@/types/employer';
import { useToast } from '@/hooks/use-toast';

// Define the props interface to match the component requirements
interface EmployerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EmployerFormData) => void;
  employer?: Employer | null;
  eligibleUsers: User[];
  isLoading: boolean;
}

// Create Zod schema to match our EmployerFormData type
const employerFormSchema = z.object({
  employerName: z.string().min(1, "Employer name is required"),
  userId: z.string().optional(),
});

// Type for the form data as handled by React Hook Form
type EmployerFormValues = z.infer<typeof employerFormSchema>;

const EmployerFormDialog: React.FC<EmployerFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  employer,
  eligibleUsers,
  isLoading
}) => {
  const { toast } = useToast();
  const isEditing = !!employer;

  const form = useForm<EmployerFormValues>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      employerName: employer?.employerName || "",
      userId: employer?.userId ? String(employer.userId) : undefined,
    }
  });

  const handleSubmit = (values: EmployerFormValues) => {
    // Convert userId from string to number or undefined
    const formattedValues: EmployerFormData = {
      employerName: values.employerName,
      userId: values.userId ? parseInt(values.userId) : undefined
    };
    
    onSubmit(formattedValues);
    
    toast({
      title: isEditing ? "Employer Updated" : "Employer Created",
      description: `${values.employerName} has been ${isEditing ? 'updated' : 'created'} successfully.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Employer' : 'Add New Employer'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the employer information below.' 
              : 'Fill in the details for the new employer.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter employer name" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Representative (Optional)</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user representative" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eligibleUsers.length === 0 ? (
                        <SelectItem value="no-users" disabled>
                          No eligible users available
                        </SelectItem>
                      ) : (
                        <>
                          <SelectItem value="">None</SelectItem>
                          {eligibleUsers.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
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
                className="bg-admin text-white"
                disabled={isLoading}
              >
                {isEditing ? 'Update Employer' : 'Add Employer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployerFormDialog;
