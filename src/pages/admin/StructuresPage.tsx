
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Building, MapPin, Phone, Mail, Users } from 'lucide-react';

const StructuresPage: React.FC = () => {
  const structures = [
    {
      id: 1,
      name: 'Main Training Center',
      type: 'Training Center',
      address: '123 Education Ave, San Francisco, CA 94107',
      phone: '+1 (555) 123-4567',
      email: 'info@maintrainingcenter.example.com',
      capacity: 250,
      classrooms: 12,
      image: 'https://placehold.co/800x400/2563EB/FFFFFF/png?text=Main%20Training%20Center&font=montserrat'
    },
    {
      id: 2,
      name: 'Downtown Tech Hub',
      type: 'Satellite Office',
      address: '456 Technology Blvd, San Francisco, CA 94104',
      phone: '+1 (555) 987-6543',
      email: 'hub@downtown.example.com',
      capacity: 120,
      classrooms: 5,
      image: 'https://placehold.co/800x400/4F46E5/FFFFFF/png?text=Downtown%20Tech%20Hub&font=montserrat'
    },
    {
      id: 3,
      name: 'East Bay Campus',
      type: 'Campus',
      address: '789 Learning St, Oakland, CA 94612',
      phone: '+1 (555) 456-7890',
      email: 'eastbay@campus.example.com',
      capacity: 350,
      classrooms: 18,
      image: 'https://placehold.co/800x400/7C3AED/FFFFFF/png?text=East%20Bay%20Campus&font=montserrat'
    },
    {
      id: 4,
      name: 'South Bay Office',
      type: 'Satellite Office',
      address: '101 Training Rd, San Jose, CA 95110',
      phone: '+1 (555) 234-5678',
      email: 'southbay@office.example.com',
      capacity: 85,
      classrooms: 4,
      image: 'https://placehold.co/800x400/2563EB/FFFFFF/png?text=South%20Bay%20Office&font=montserrat'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Structures</h1>
        <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          Add Structure
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search structures..." className="pl-8" />
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="training">Training Centers</TabsTrigger>
            <TabsTrigger value="satellite">Satellite Offices</TabsTrigger>
            <TabsTrigger value="campus">Campuses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures.map(structure => (
            <Card key={structure.id} className="overflow-hidden">
              <img 
                src={structure.image} 
                alt={structure.name} 
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-admin" />
                  {structure.name}
                </CardTitle>
                <span className="text-sm text-gray-500">{structure.type}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm">{structure.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{structure.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{structure.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-lg">{structure.capacity}</div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="font-bold text-lg">{structure.classrooms}</div>
                    <div className="text-xs text-gray-500">Classrooms</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="training" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures
            .filter(s => s.type === 'Training Center')
            .map(structure => (
              <Card key={structure.id} className="overflow-hidden">
                {/* Similar content to the "all" tab */}
                <img 
                  src={structure.image} 
                  alt={structure.name} 
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-admin" />
                    {structure.name}
                  </CardTitle>
                  <span className="text-sm text-gray-500">{structure.type}</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">{structure.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.capacity}</div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.classrooms}</div>
                      <div className="text-xs text-gray-500">Classrooms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </TabsContent>
      
      {/* Similar TabsContent for "satellite" and "campus" */}
      <TabsContent value="satellite" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures
            .filter(s => s.type === 'Satellite Office')
            .map(structure => (
              <Card key={structure.id} className="overflow-hidden">
                {/* Similar content structure */}
                <img 
                  src={structure.image} 
                  alt={structure.name} 
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-admin" />
                    {structure.name}
                  </CardTitle>
                  <span className="text-sm text-gray-500">{structure.type}</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">{structure.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.capacity}</div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.classrooms}</div>
                      <div className="text-xs text-gray-500">Classrooms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </TabsContent>
      
      <TabsContent value="campus" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures
            .filter(s => s.type === 'Campus')
            .map(structure => (
              <Card key={structure.id} className="overflow-hidden">
                {/* Similar content structure */}
                <img 
                  src={structure.image} 
                  alt={structure.name} 
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-admin" />
                    {structure.name}
                  </CardTitle>
                  <span className="text-sm text-gray-500">{structure.type}</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">{structure.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{structure.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.capacity}</div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-bold text-lg">{structure.classrooms}</div>
                      <div className="text-xs text-gray-500">Classrooms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </TabsContent>
    </div>
  );
};

export default StructuresPage;
