
import React from 'react';
import InstructorCard from './InstructorCard';
import { Instructor } from '@/hooks/useInstructors';

interface InstructorListProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: number, name: string) => void;
  onViewDetails: (id: number) => void;
}

const InstructorList: React.FC<InstructorListProps> = ({ 
  instructors, 
  onEdit, 
  onDelete,
  onViewDetails
}) => {
  if (instructors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No instructors found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {instructors.map((instructor) => (
        <InstructorCard 
          key={instructor.id}
          instructor={instructor}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default InstructorList;
