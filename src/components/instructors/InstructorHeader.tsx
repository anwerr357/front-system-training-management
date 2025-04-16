
import React from 'react';
import { Button } from "@/components/ui/button";
import { GraduationCap } from 'lucide-react';

interface InstructorHeaderProps {
  onAddInstructor: () => void;
}

const InstructorHeader: React.FC<InstructorHeaderProps> = ({ onAddInstructor }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Instructors</h1>
      <Button className="bg-admin text-white" onClick={onAddInstructor}>
        <GraduationCap size={18} className="mr-2" />
        Add Instructor
      </Button>
    </div>
  );
};

export default InstructorHeader;
