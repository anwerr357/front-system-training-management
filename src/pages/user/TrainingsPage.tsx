
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Search, 
  Download, 
  BookOpenCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTrainings, useParticipantTrainings } from "@/hooks/useParticipants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTraining, useTrainingRequest } from '@/hooks/useTrainings';
import { userInfo } from 'os';
import { json } from 'stream/consumers';

// Define a local interface for our UI-specific training model
interface UITraining {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  description: string;
  enrolled: boolean;
  enrollmentStatus: 'approved' | 'pending' | 'rejected' | null;
  completed?: boolean;
  materials: Material[];
}

interface Material {
  id: number;
  name: string;
  type: string;
  content?: string; // Base64 content or URL
}

const UserTrainingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Get user ID from localStorage
  const storedUser = localStorage.getItem('user');
  const userId= JSON.parse(storedUser).id;
  // Fetch user's enrolled trainings
  const { data: apiTrainings, isLoading, error } = useParticipantTrainings(userId ? parseInt(userId) : null);
  const {data : apiAllTrainings} = useTrainings();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: createEnrollmentRequest, isPending: isCreating, isSuccess: isCreateSuccess, isError: isCreateError } = useTrainingRequest();

  

    // Transform API trainings to UI trainings format
  const transformApiToUiTrainings = (): UITraining[] => {
    if (!apiAllTrainings || !apiTrainings) return [];
  
    return apiAllTrainings.map(training => {
      const enrolled = apiTrainings.some(t => t.id === training.id);
      const startDate = new Date(training.startTime);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + training.duration); // assuming duration is in days
  
      const now = new Date();
      const completed = now > endDate;
      // console.log(completed)
      return {
        id: training.id,
        title: training.title,
        category: training.status || 'General',
        date: formatDateRange(training.startTime, training.duration),
        time: '9:00 AM - 4:00 PM',
        location: 'Training Center',
        capacity: '20 spots',
        description: training.description || 'No description available',
        enrolled: enrolled, 
        enrollmentStatus: enrolled ? 'approved' as const : 'pending' as const, // or you can set default
        completed: completed,
        materials: []
      };
    });
  };
 
  // Helper function to format date range
  const formatDateRange = (startDate: string, duration : number): string => {
    try {
      
      const start = (new Date(startDate));
      const end = new Date(start.getTime()+(duration*3600000*24));
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    } catch (e) {
      return 'Date not available';
    }
  };
  
  const [description , setDescription] = useState<string>("");
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<UITraining | null>(null);
  const [trainingDetailsDialog, setTrainingDetailsDialog] = useState(false);
  const [certificateDialog, setCertificateDialog] = useState(false);
  // const [enrollmentMessage, setEnrollmentMessage] = useState<string>("");
  
  // Define the mock trainings with proper type for enrollmentStatus
  const mockTrainings: UITraining[] = [
    { 
      id: 1001, 
      title: 'Introduction to Cloud Computing', 
      category: 'Technical',
      date: 'May 10-12, 2025', 
      time: '9:00 AM - 4:00 PM', 
      location: 'Training Center - Room 101',
      capacity: '20 spots available',
      description: 'Learn the fundamentals of cloud computing, including AWS, Azure, and Google Cloud services.',
      enrolled: false,
      enrollmentStatus: null,
      materials: []
    },
    { 
      id: 1002, 
      title: 'Project Management Basics', 
      category: 'Technical',
      date: 'April 15-17, 2025', 
      time: '9:00 AM - 4:00 PM', 
      location: 'Training Center - Room 103',
      capacity: '12 spots available',
      description: 'Learn the core principles of project management and practical implementation.',
      enrolled: true,
      enrollmentStatus: 'pending',
      materials: []
    },
    { 
      id: 1003, 
      title: 'Data Analysis Fundamentals', 
      category: 'Technical',
      date: 'March 20-22, 2025', 
      time: '10:00 AM - 3:00 PM', 
      location: 'Online (Zoom)',
      capacity: '25 spots available',
      description: 'Master the basics of data analysis with hands-on exercises.',
      enrolled: true,
      enrollmentStatus: 'approved',
      completed: true,
      materials: [
        { 
          id: 3, 
          name: 'Data Analysis Guide.pdf', 
          type: 'PDF',
          content: 'data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PC9UeXBlL1hPYmplY3QvU3VidHlwZS9JbWFnZS9XaWR0aCAxMjc1L0hlaWdodCA4NTAvQml0c1BlckNvbXBvbmVudCA4L0NvbG9yU3BhY2UvRGV2aWNlUkdCL0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMjE3ODY+PgpzdHJlYW0KeJzt3QmUXGWB//EhiaBsIRE1OiAosrigoo4Lhscgj+uD9CiLG... (mock base64 data)' 
        },
        { 
          id: 4, 
          name: 'Exercise Workbook.xlsx', 
          type: 'XLSX',
          content: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQD21qXvWgEAAI4... (mock base64 data)' 
        }
      ]
    }
  ];
  // Use transformed API trainings and add mock data
  const uiTrainings: UITraining[] = [
    ...transformApiToUiTrainings()  ];

  const filteredTrainings = uiTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || training.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableTrainings = filteredTrainings.filter(t => !t.enrolled && !t.completed);
  const myEnrolledTrainings = filteredTrainings.filter(t => t.enrolled && !t.completed);
  const completedTrainings = filteredTrainings.filter(t => t.completed);

  const handleEnrollRequest = () => {
    if (!selectedTraining) return;
    const trainingId = selectedTraining.id;
    createEnrollmentRequest({
      userId,
      trainingId,
      description      
    })
    
    
    toast({
      title: "Enrollment Request Sent",
      description: `Your request to enroll in "${selectedTraining.title}" has been sent for approval.`,
    });
    setDescription('');
    setEnrollDialog(false);
  };

  const handleMaterialDownload = (material: Material) => {
    if (!material.content) {
      toast({
        title: "Download Failed",
        description: "Material content is not available.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let content = "This is a sample content for " + material.name;
      let mimeType = "application/octet-stream";
      
      if (material.content.startsWith('data:')) {
        const dataUrlRegex = /^data:([^;]+);base64,/;
        const matches = material.content.match(dataUrlRegex);
        
        if (matches && matches.length > 1) {
          mimeType = matches[1];
        }
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = material.name;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Material Downloaded",
        description: `${material.name} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCertificateDownload = () => {
    if (!selectedTraining) return;
    
    const certificateContent = `
      <html>
        <head>
          <title>Certificate of Completion</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            .certificate { border: 10px solid #333; padding: 30px; }
            h1 { font-size: 36px; margin-bottom: 20px; }
            .name { font-size: 28px; margin: 20px 0; font-weight: bold; }
            .course { font-size: 24px; margin: 10px 0; }
            .date { font-size: 18px; margin: 20px 0; }
            .signature { margin-top: 60px; border-top: 1px solid #333; padding-top: 10px; width: 200px; margin: 60px auto 0; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>Certificate of Completion</h1>
            <p>This certifies that</p>
            <p class="name">Participant User</p>
            <p>has successfully completed</p>
            <p class="course">${selectedTraining.title}</p>
            <p class="date">${selectedTraining.date}</p>
            <p class="signature">Training Director</p>
            <p>Certificate ID: CERT-${selectedTraining.id}-${Date.now().toString().slice(-6)}</p>
          </div>
        </body>
      </html>
    `;
    
    try {
      const blob = new Blob([certificateContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate - ${selectedTraining.title}.html`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded successfully.",
      });
      
      setCertificateDialog(false);
    } catch (error) {
      console.error("Certificate download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: 'approved' | 'pending' | 'rejected' | null) => {
    if (!status) return null;
    
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="h-3 w-3 mr-1" />Pending Approval</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-lg">Failed to load trainings.</p>
        <p className="text-sm">Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Training Management</h1>
        <p className="text-gray-600">Browse, enroll and manage your training courses</p>
      </div>

      <Tabs defaultValue="available" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Trainings</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Trainings</TabsTrigger>
          <TabsTrigger value="completed">Completed Trainings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="pt-4">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search trainings..."
                className="py-2 pl-10 pr-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-participant"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex space-x-2">
              <select 
                className="py-2 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-participant"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6">
            {availableTrainings.map((training) => (
              <div key={training.id} className="dashboard-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-900 mr-3">{training.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {training.category}
                      </span>
                    </div>
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
                        <BookOpen className="mr-1.5 h-4 w-4 text-gray-400" />
                        {training.capacity}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{training.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button
                      onClick={() => {
                        setSelectedTraining(training);
                        setEnrollDialog(true);
                        
                      }}
                      className="bg-participant text-white hover:bg-participant-light"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {availableTrainings.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <BookOpen className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-lg font-medium">No available trainings found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="enrolled" className="pt-4">
          <div className="grid gap-6">
            {myEnrolledTrainings.map((training) => (
              <div key={training.id} className="dashboard-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 mr-3">{training.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {training.category}
                      </span>
                      {getStatusBadge(training.enrollmentStatus)}
                    </div>
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
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedTraining(training);
                        setTrainingDetailsDialog(true);
                      }}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {myEnrolledTrainings.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <BookOpenCheck className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-lg font-medium">No enrolled trainings</p>
                <p className="text-sm">Browse available trainings to enroll</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <div className="grid gap-6">
            {completedTrainings.map((training) => (
              <div key={training.id} className="dashboard-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold text-gray-900 mr-3">{training.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {training.category}
                      </span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 ml-2">
                        <CheckCircle className="h-3 w-3 mr-1" />Completed
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                        {training.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                        {training.time}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedTraining(training);
                        setTrainingDetailsDialog(true);
                      }}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                    <Button 
                      className="bg-participant text-white hover:bg-participant-light"
                      onClick={() => {
                        setSelectedTraining(training);
                        setCertificateDialog(true);
                      }}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Certificate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {completedTrainings.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <CheckCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-lg font-medium">No completed trainings</p>
                <p className="text-sm">Your completed trainings will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={enrollDialog} onOpenChange={(open) => {
        setEnrollDialog(open);
        if (!open) setDescription('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
            <DialogDescription>
              Your request will be sent to the administrator for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to request enrollment in:</p>
            <p className="font-semibold text-lg mt-2">{selectedTraining?.title}</p>
            <p className="text-sm text-gray-500 mt-1">{selectedTraining?.date}</p>
            
            <div className="mt-4">
              <Label htmlFor="enrollment-message" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Additional Message (Optional)
              </Label>
              <Textarea 
                id="enrollment-message"
                placeholder="Add any additional information for your enrollment request..."
                className="mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEnrollDialog(false);
              setDescription('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleEnrollRequest} className="bg-participant text-white hover:bg-participant-light">
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={trainingDetailsDialog} onOpenChange={setTrainingDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title}</DialogTitle>
            <DialogDescription>
              Details and materials for this training course
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{selectedTraining?.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{selectedTraining?.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{selectedTraining?.location}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Details</h3>
                <p className="text-sm">{selectedTraining?.description}</p>
                <div className="mt-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {selectedTraining?.category}
                  </span>
                  {selectedTraining?.enrollmentStatus && (
                    <span className="ml-2">
                      {getStatusBadge(selectedTraining?.enrollmentStatus)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Training Materials</h3>
              
              {selectedTraining?.materials && selectedTraining.materials.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTraining.materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMaterialDownload(material)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-gray-500">No materials available for this training.</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrainingDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={certificateDialog} onOpenChange={setCertificateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Certificate</DialogTitle>
            <DialogDescription>
              Your training completion certificate is ready to download
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-serif mb-4">Certificate of Completion</div>
              <p className="mb-2">This is to certify that</p>
              <p className="text-lg font-bold mb-2">Participant User</p>
              <p className="mb-4">has successfully completed</p>
              <p className="text-xl font-bold mb-2">{selectedTraining?.title}</p>
              <p className="text-sm text-gray-500 mb-6">{selectedTraining?.date}</p>
              <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500">
                Training Certificate ID: CERT-{selectedTraining?.id}-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCertificateDownload}
              className="bg-participant text-white hover:bg-participant-light"
            >
              <Download className="mr-1.5 h-4 w-4" />
              Download Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserTrainingsPage;
