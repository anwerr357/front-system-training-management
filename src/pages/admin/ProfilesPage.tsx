
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle, BookOpen, Star } from 'lucide-react';

const ProfilesPage: React.FC = () => {
  const profiles = [
    {
      id: 1,
      name: 'Web Developer',
      type: 'Technical',
      skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js'],
      requirements: ['Computer Science degree or equivalent', 'Problem-solving skills', 'Team collaboration'],
      duration: '12 weeks',
      level: 'Intermediate',
      popularity: 'High',
      completionRate: 85
    },
    {
      id: 2,
      name: 'Data Analyst',
      type: 'Technical',
      skills: ['SQL', 'Python', 'Data Visualization', 'Statistics'],
      requirements: ['Analytical thinking', 'Mathematics background', 'Attention to detail'],
      duration: '10 weeks',
      level: 'Intermediate',
      popularity: 'Medium',
      completionRate: 78
    },
    {
      id: 3,
      name: 'UX/UI Designer',
      type: 'Creative',
      skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
      requirements: ['Design thinking', 'Empathy', 'Communication skills'],
      duration: '8 weeks',
      level: 'Beginner',
      popularity: 'High',
      completionRate: 92
    },
    {
      id: 4,
      name: 'Digital Marketing Specialist',
      type: 'Business',
      skills: ['SEO', 'Social Media Marketing', 'Content Creation', 'Analytics'],
      requirements: ['Marketing knowledge', 'Creativity', 'Strategic thinking'],
      duration: '6 weeks',
      level: 'Beginner',
      popularity: 'Medium',
      completionRate: 88
    },
    {
      id: 5,
      name: 'Cloud Engineer',
      type: 'Technical',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      requirements: ['IT background', 'System administration', 'Networking knowledge'],
      duration: '14 weeks',
      level: 'Advanced',
      popularity: 'High',
      completionRate: 72
    },
    {
      id: 6,
      name: 'Project Manager',
      type: 'Business',
      skills: ['Agile Methodologies', 'Risk Management', 'Team Leadership', 'Budgeting'],
      requirements: ['Organization skills', 'Communication', 'Problem-solving'],
      duration: '8 weeks',
      level: 'Intermediate',
      popularity: 'Medium',
      completionRate: 81
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Profiles</h1>
        <button className="bg-admin text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          Add Profile
        </button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <Card key={profile.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{profile.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      profile.type === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                      profile.type === 'Creative' ? 'bg-purple-100 text-purple-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {profile.type}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{profile.level}</span>
                    <span className="mx-2">•</span>
                    <span>{profile.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Key Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Requirements
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
                      {profile.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{profile.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${profile.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Popularity: {profile.popularity}</span>
                      </span>
                    </div>
                    <button className="text-admin text-sm font-medium hover:underline">
                      View Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Similar TabsContent for "technical", "creative", and "business" */}
        <TabsContent value="technical" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles
              .filter(p => p.type === 'Technical')
              .map(profile => (
                <Card key={profile.id} className="shadow-md hover:shadow-lg transition-shadow">
                  {/* Same card content as "all" */}
                  <CardHeader className="pb-2">
                    <CardTitle>{profile.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        {profile.type}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{profile.level}</span>
                      <span className="mx-2">•</span>
                      <span>{profile.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Requirements
                      </h3>
                      <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
                        {profile.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">{profile.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${profile.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Popularity: {profile.popularity}</span>
                        </span>
                      </div>
                      <button className="text-admin text-sm font-medium hover:underline">
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="creative" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles
              .filter(p => p.type === 'Creative')
              .map(profile => (
                <Card key={profile.id} className="shadow-md hover:shadow-lg transition-shadow">
                  {/* Same card content as "all" */}
                  <CardHeader className="pb-2">
                    <CardTitle>{profile.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                        {profile.type}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{profile.level}</span>
                      <span className="mx-2">•</span>
                      <span>{profile.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Requirements
                      </h3>
                      <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
                        {profile.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">{profile.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${profile.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Popularity: {profile.popularity}</span>
                        </span>
                      </div>
                      <button className="text-admin text-sm font-medium hover:underline">
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="business" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles
              .filter(p => p.type === 'Business')
              .map(profile => (
                <Card key={profile.id} className="shadow-md hover:shadow-lg transition-shadow">
                  {/* Same card content as "all" */}
                  <CardHeader className="pb-2">
                    <CardTitle>{profile.name}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        {profile.type}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{profile.level}</span>
                      <span className="mx-2">•</span>
                      <span>{profile.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Requirements
                      </h3>
                      <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
                        {profile.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">{profile.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${profile.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Popularity: {profile.popularity}</span>
                        </span>
                      </div>
                      <button className="text-admin text-sm font-medium hover:underline">
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilesPage;
