
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface EmployerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EmployerSearch: React.FC<EmployerSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input 
        placeholder="Search employers..." 
        className="pl-8" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default EmployerSearch;
