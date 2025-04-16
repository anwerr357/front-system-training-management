
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmployerHeaderProps {
  onAddEmployer: () => void;
}

const EmployerHeader: React.FC<EmployerHeaderProps> = ({ onAddEmployer }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Employer Management</h1>
      <Button className="bg-admin text-white" onClick={onAddEmployer}>
        <Plus size={18} className="mr-2" />
        Add Employer
      </Button>
    </div>
  );
};

export default EmployerHeader;
