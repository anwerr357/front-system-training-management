
import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, FileText, Book, Upload, Download, Plus, X } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  
  // New states for adding materials
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    type: 'PDF',
    file: null as File | null
  });

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

  // State for managing materials
  const [materials, setMaterials] = useState(trainingMaterials);

  const handleViewDetails = (training: any) => {
    setSelectedTraining(training);
    setViewDetailsOpen(true);
  };

  const handleViewMaterials = (training: any) => {
    setSelectedTraining(training);
    setMaterialsOpen(true);
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setNewMaterial({
        ...newMaterial,
        file: selectedFile,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  // Function to add a new material
  const handleAddMaterial = () => {
    if (!selectedTraining || !newMaterial.name || !newMaterial.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create a new material
    const newMaterialItem = {
      id: materials[selectedTraining.id]?.length > 0 
        ? Math.max(...materials[selectedTraining.id].map(m => m.id)) + 1 
        : 1,
      name: newMaterial.name,
      type: newMaterial.type,
      size: newMaterial.file ? `${(newMaterial.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB'
    };

    // Update the materials state
    const updatedMaterials = { ...materials };
    if (!updatedMaterials[selectedTraining.id]) {
      updatedMaterials[selectedTraining.id] = [];
    }
    updatedMaterials[selectedTraining.id] = [...updatedMaterials[selectedTraining.id], newMaterialItem];
    
    setMaterials(updatedMaterials);
    setAddMaterialOpen(false);
    
    // Reset the new material form
    setNewMaterial({
      name: '',
      type: 'PDF',
      file: null
    });

    toast({
      title: "Material Added",
      description: `${newMaterial.name} has been added to the training materials.`
    });
  };

  // Function to handle material download
  const handleDownloadMaterial = (material: any) => {
    // In a real application, this would trigger an API call to download the file
    // For demo purposes, we'll simulate a download
    const dummyElement = document.createElement('a');
    
    // Create a blob URL for demonstration (this would be a real file URL in production)
    const blob = new Blob(['This is a sample content for ' + material.name], { type: 'text/plain' });
    dummyElement.href = window.URL.createObjectURL(blob);
    
    // Set the file name
    dummyElement.download = material.name + (
      material.type === 'PDF' ? '.pdf' : 
      material.type === 'Video' ? '.mp4' : 
      material.type === 'ZIP' ? '.zip' : 
      material.type === 'Notebook' ? '.ipynb' : 
      material.type === 'Code Samples' ? '.js' : '.txt'
    );
    
    // Append to body, click and remove
    document.body.appendChild(dummyElement);
    dummyElement.click();
    document.body.removeChild(dummyElement);
    
    toast({
      title: "Download Started",
      description: `${material.name} is being downloaded.`
    });
  };

  // Function to remove a material
  const handleRemoveMaterial = (materialId: number) => {
    if (!selectedTraining) return;
    
    const updatedMaterials = { ...materials };
    updatedMaterials[selectedTraining.id] = updatedMaterials[selectedTraining.id].filter(
      m => m.id !== materialId
    );
    
    setMaterials(updatedMaterials);
    
    toast({
      title: "Material Removed",
      description: "The material has been removed successfully."
    });
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Available Materials</h3>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => setAddMaterialOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedTraining && materials[selectedTraining.id]?.length > 0 ? (
                materials[selectedTraining.id]?.map((material) => (
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
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadMaterial(material)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-gray-500">
                  No materials available for this training yet.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setMaterialsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>
              Upload a new material for {selectedTraining?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-name">Material Name</Label>
              <Input 
                id="material-name" 
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                placeholder="e.g., Course Handbook, Exercise Files"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material-type">Material Type</Label>
              <select 
                id="material-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newMaterial.type}
                onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
              >
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Code Samples">Code Samples</option>
                <option value="Notebook">Notebook</option>
                <option value="ZIP">ZIP Archive</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material-file">Upload File</Label>
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="material-file" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, Video, ZIP, or other files (max. 100MB)</p>
                  </div>
                  <Input 
                    id="material-file" 
                    type="file" 
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {newMaterial.file && (
                <p className="text-sm text-gray-600">
                  Selected file: {newMaterial.file.name} ({(newMaterial.file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMaterialOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMaterial}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorTrainingsPage;
