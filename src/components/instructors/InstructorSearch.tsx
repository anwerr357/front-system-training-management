
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface InstructorSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InstructorSearch: React.FC<InstructorSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input 
        placeholder="Search instructors..." 
        className="pl-8" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default InstructorSearch;
