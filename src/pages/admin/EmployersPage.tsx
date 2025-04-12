
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MapPin, Globe, Plus } from 'lucide-react';

const EmployersPage: React.FC = () => {
  const employers = [
    {
      id: 1,
      name: 'TechSolutions Inc.',
      industry: 'Software Development',
      location: 'San Francisco, CA',
      employees: 120,
      partnership: 'Gold',
      website: 'techsolutions.example.com',
      logo: 'https://placehold.co/200x200/4F46E5/FFFFFF/png?text=T&font=montserrat',
      trainees: 12
    },
    {
      id: 2,
      name: 'DataVision Analytics',
      industry: 'Data Science',
      location: 'Boston, MA',
      employees: 85,
      partnership: 'Silver',
      website: 'datavision.example.com',
      logo: 'https://placehold.co/200x200/2563EB/FFFFFF/png?text=D&font=montserrat',
      trainees: 8
    },
    {
      id: 3,
      name: 'Innovate UX',
      industry: 'Design & UI/UX',
      location: 'Austin, TX',
      employees: 45,
      partnership: 'Bronze',
      website: 'innovateux.example.com',
      logo: 'https://placehold.co/200x200/9333EA/FFFFFF/png?text=I&font=montserrat',
      trainees: 5
    },
    {
      id: 4,
      name: 'MobileFuture',
      industry: 'Mobile Development',
      location: 'Seattle, WA',
      employees: 60,
      partnership: 'Silver',
      website: 'mobilefuture.example.com',
      logo: 'https://placehold.co/200x200/0EA5E9/FFFFFF/png?text=M&font=montserrat',
      trainees: 7
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employer Partners</h1>
        <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          Add Employer
        </button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Partners</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
          <TabsTrigger value="silver">Silver</TabsTrigger>
          <TabsTrigger value="bronze">Bronze</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employers.map((employer) => (
              <Card key={employer.id} className="overflow-hidden">
                <div className={`h-32 flex items-center justify-center
                  ${employer.partnership === 'Gold' ? 'bg-amber-500' : 
                    employer.partnership === 'Silver' ? 'bg-gray-400' : 
                    'bg-amber-700'}`}>
                  <img 
                    src={employer.logo} 
                    alt={employer.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    {employer.name}
                  </CardTitle>
                  <CardDescription>{employer.industry}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{employer.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{employer.employees} employees</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{employer.website}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t px-4 py-3">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-600">Trainees:</span>
                    <span className="font-medium">{employer.trainees}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="gold" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employers
              .filter(emp => emp.partnership === 'Gold')
              .map((employer) => (
                <Card key={employer.id} className="overflow-hidden">
                  {/* Same card content as above */}
                  <div className="h-32 flex items-center justify-center bg-amber-500">
                    <img 
                      src={employer.logo} 
                      alt={employer.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      {employer.name}
                    </CardTitle>
                    <CardDescription>{employer.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Card content same as above */}
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.employees} employees</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.website}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t px-4 py-3">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trainees:</span>
                      <span className="font-medium">{employer.trainees}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        {/* Similar TabsContent for Silver and Bronze */}
        <TabsContent value="silver" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employers
              .filter(emp => emp.partnership === 'Silver')
              .map((employer) => (
                <Card key={employer.id} className="overflow-hidden">
                  {/* Card content similar to above */}
                  <div className="h-32 flex items-center justify-center bg-gray-400">
                    <img 
                      src={employer.logo} 
                      alt={employer.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      {employer.name}
                    </CardTitle>
                    <CardDescription>{employer.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.employees} employees</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.website}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t px-4 py-3">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trainees:</span>
                      <span className="font-medium">{employer.trainees}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="bronze" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employers
              .filter(emp => emp.partnership === 'Bronze')
              .map((employer) => (
                <Card key={employer.id} className="overflow-hidden">
                  {/* Card content similar to above */}
                  <div className="h-32 flex items-center justify-center bg-amber-700">
                    <img 
                      src={employer.logo} 
                      alt={employer.name}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      {employer.name}
                    </CardTitle>
                    <CardDescription>{employer.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.employees} employees</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{employer.website}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t px-4 py-3">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trainees:</span>
                      <span className="font-medium">{employer.trainees}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployersPage;
