
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Mail, Phone, Calendar, Edit, Trash, MoreVertical, Info } from 'lucide-react';
import { Instructor } from '@/hooks/useInstructors';

interface InstructorCardProps {
  instructor: Instructor;
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: number, name: string) => void;
  onViewDetails: (id: number) => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ 
  instructor, 
  onEdit, 
  onDelete,
  onViewDetails
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center relative">
        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
          <span className="text-blue-700 text-2xl font-bold">
            {instructor.name.charAt(0)}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/20 text-white hover:bg-white/30">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(instructor.id)}>
                <Info size={14} className="mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(instructor)}>
                <Edit size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(instructor.id, instructor.name)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-center">{instructor.name}</CardTitle>
        <p className="text-center text-sm text-gray-500">{instructor.specialty}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          <span>{instructor.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          <span>{instructor.phone}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>Available: {instructor.availability}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
