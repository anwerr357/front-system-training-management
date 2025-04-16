import React, { useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Instructor, InstructorFormData } from '@/hooks/useInstructors';
import { User } from '@/types/employer';
import { Employer } from '@/types/employer';

interface InstructorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstructorFormData) => void;
  instructor?: Instructor | null;
  users: User[];
  employers: Employer[];
  isLoading: boolean;
  instructorUserIds: number[];
}

const instructorFormSchema = z.object({
  userId: z.string().min(1, "User is required"),
  specialty: z.string().min(1, "Specialty is required"),
  phone: z.string().min(1, "Phone number is required"),
  availability: z.string().min(1, "Availability is required"),
  employerId: z.string().optional(),
  type: z.string().default("Full-Time"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type InstructorFormValues = z.infer<typeof instructorFormSchema>;

const InstructorFormDialog: React.FC<InstructorFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  instructor,
  users,
  employers,
  isLoading,
  instructorUserIds
}) => {
  const isEditing = !!instructor;

  const specialties = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Mobile Development',
    'Cloud Computing',
    'Machine Learning',
    'DevOps',
    'Cybersecurity'
  ];

  const availabilityOptions = [
    'Mon-Wed',
    'Tue-Fri',
    'Wed-Sat',
    'Mon-Thu',
    'Thu-Sat',
    'Weekends Only',
    'Full Week'
  ];

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      userId: instructor?.userId ? String(instructor.userId) : "",
      specialty: instructor?.specialty || "",
      phone: instructor?.phone || "",
      availability: instructor?.availability || "",
      employerId: instructor?.employerId ? String(instructor.employerId) : "",
      type: instructor?.type || "Full-Time",
      firstName: instructor?.firstName || "",
      lastName: instructor?.lastName || "",
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        userId: instructor?.userId ? String(instructor.userId) : "",
        specialty: instructor?.specialty || "",
        phone: instructor?.phone || "",
        availability: instructor?.availability || "",
        employerId: instructor?.employerId ? String(instructor.employerId) : "",
        type: instructor?.type || "Full-Time",
        firstName: instructor?.firstName || "",
        lastName: instructor?.lastName || "",
      });
    }
  }, [open, instructor, form]);

  const handleSubmit = (values: InstructorFormValues) => {
    const selectedUser = users.find(user => user.id === parseInt(values.userId));
    
    if (!selectedUser) {
      return;
    }
    
    const formattedValues: InstructorFormData = {
      userId: parseInt(values.userId),
      specialty: values.specialty,
      phone: values.phone,
      availability: values.availability,
      employerId: values.employerId && values.employerId !== "none" 
        ? parseInt(values.employerId) 
        : undefined,
      firstName: values.firstName || selectedUser.name.split(' ')[0],
      lastName: values.lastName || selectedUser.name.split(' ')[1] || '',
      type: values.type,
      email: selectedUser.email,
    };
    
    onSubmit(formattedValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the instructor information below.' 
              : 'Select a user and fill in the instructor details.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  {isLoading ? (
                    <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center text-muted-foreground">
                      Loading users...
                    </div>
                  ) : (
                    <Select
                      disabled={isLoading || isEditing}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.length === 0 ? (
                          <SelectItem value="no-users" disabled>
                            No eligible users available
                          </SelectItem>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
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
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer (Optional)</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {employers.map((employer) => (
                        <SelectItem key={employer.id} value={String(employer.id)}>
                          {employer.employerName}
                        </SelectItem>
                      ))}
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
                {isEditing ? 'Update Instructor' : 'Add Instructor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorFormDialog;
