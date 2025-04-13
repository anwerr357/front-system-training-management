
import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, FileText, Book } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// Sample training materials data
const trainingMaterials = {
  1: [
    { id: 1, name: 'JavaScript Fundamentals Handbook', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Advanced Closure Examples', type: 'Code Samples', size: '1.1 MB' },
    { id: 3, name: 'Async Programming Workshop', type: 'Video', size: '156 MB' }
  ],
  2: [
    { id: 1, name: 'Introduction to Python', type: 'PDF', size: '3.2 MB' },
    { id: 2, name: 'Data Visualization Examples', type: 'Notebook', size: '5.6 MB' }
  ],
  3: [
    { id: 1, name: 'Project Management Guide', type: 'PDF', size: '4.3 MB' },
    { id: 2, name: 'Templates and Checklists', type: 'ZIP', size: '8.7 MB' },
    { id: 3, name: 'Case Studies', type: 'PDF', size: '2.1 MB' }
  ]
};

// Sample detailed course modules
const courseModules = {
  1: [
    { 
      title: 'JavaScript Core Concepts', 
      description: 'Understanding closures, prototypes, and the this keyword',
      duration: '3 hours'
    },
    { 
      title: 'Asynchronous Programming', 
      description: 'Working with Promises, async/await, and event loop',
      duration: '4 hours'
    },
    { 
      title: 'Modern JavaScript Frameworks', 
      description: 'Overview of React, Vue, and Angular core principles',
      duration: '5 hours'
    }
  ],
  2: [
    { 
      title: 'Data Science Fundamentals', 
      description: 'Statistics basics and data handling',
      duration: '3 hours'
    },
    { 
      title: 'Python for Data Analysis', 
      description: 'Using pandas, numpy and matplotlib',
      duration: '4 hours'
    }
  ],
  3: [
    { 
      title: 'Project Planning', 
      description: 'Requirements gathering and scope definition',
      duration: '4 hours'
    },
    { 
      title: 'Project Execution', 
      description: 'Managing resources and timeline tracking',
      duration: '5 hours'
    },
    { 
      title: 'Project Monitoring', 
      description: 'KPIs and progress reporting techniques',
      duration: '3 hours'
    },
    { 
      title: 'Project Closure', 
      description: 'Final deliverables and lessons learned',
      duration: '3 hours'
    }
  ]
};

const InstructorTrainingsPage: React.FC = () => {
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const trainings = [
    { 
      id: 1, 
      title: 'Advanced JavaScript Programming', 
      date: 'May 5-7, 2025', 
      time: '9:00 AM - 4:00 PM', 
      location: 'Training Center - Room 201',
      participants: 18,
      description: 'A comprehensive course covering advanced JavaScript concepts including closures, prototypes, and async programming.'
    },
    { 
      id: 2, 
      title: 'Introduction to Data Science', 
      date: 'May 15-16, 2025', 
      time: '10:00 AM - 3:00 PM', 
      location: 'Online (Zoom)',
      participants: 25,
      description: 'An introductory course to data science fundamentals, covering statistics, Python, and data visualization basics.'
    },
    { 
      id: 3, 
      title: 'Project Management Fundamentals', 
      date: 'June 1-5, 2025', 
      time: '9:00 AM - 5:00 PM', 
      location: 'Training Center - Room 105',
      participants: 15,
      description: 'Learn the essential skills needed to successfully manage projects, including planning, execution, and monitoring.'
    }
  ];

  const handleViewDetails = (training: any) => {
    setSelectedTraining(training);
    setViewDetailsOpen(true);
  };

  const handleViewMaterials = (training: any) => {
    setSelectedTraining(training);
    setMaterialsOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Trainings</h1>
        <p className="text-gray-600">View and manage your assigned trainings</p>
      </div>

      <div className="grid gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="dashboard-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{training.title}</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                    {training.participants} participants
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{training.description}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button 
                  onClick={() => handleViewDetails(training)}
                  className="px-4 py-2 bg-instructor text-white text-sm font-medium rounded-md hover:bg-instructor-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instructor"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleViewMaterials(training)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instructor"
                >
                  Materials
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about this training.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <p>{selectedTraining?.description}</p>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Quick Information</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-medium mr-2">Dates:</span> {selectedTraining?.date}
                    </li>
                    <li className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-medium mr-2">Time:</span> {selectedTraining?.time}
                    </li>
                    <li className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-medium mr-2">Participants:</span> {selectedTraining?.participants}
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="modules">
                <Accordion type="single" collapsible className="w-full">
                  {selectedTraining && courseModules[selectedTraining.id]?.map((module, idx) => (
                    <AccordionItem key={idx} value={`module-${idx}`}>
                      <AccordionTrigger>{module.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p>{module.description}</p>
                          <p className="text-sm text-gray-500">Duration: {module.duration}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="logistics">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      {selectedTraining?.location}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Equipment Needed</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Laptop with necessary software installed</li>
                      <li>Training materials (provided)</li>
                      <li>Notebook and pen for notes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">
                      For any questions regarding this training, please contact the training coordinator at training@example.com
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setViewDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Materials Dialog */}
      <Dialog open={materialsOpen} onOpenChange={setMaterialsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Training Materials</DialogTitle>
            <DialogDescription>
              Access all materials for {selectedTraining?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {selectedTraining && trainingMaterials[selectedTraining.id]?.map((material) => (
                <div 
                  key={material.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {material.type === 'PDF' ? (
                      <FileText className="h-5 w-5 text-red-500 mr-3" />
                    ) : material.type === 'Video' ? (
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    ) : (
                      <Book className="h-5 w-5 text-green-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.type} • {material.size}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setMaterialsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorTrainingsPage;
