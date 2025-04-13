
import React, { useState } from 'react';
import { useRequests } from "@/contexts/RequestsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Check, X, Eye, GraduationCap } from 'lucide-react';
import { logActivity } from '@/utils/activityUtils';
import { format, formatDistanceToNow } from 'date-fns';

const EnrollmentRequestsPage: React.FC = () => {
  const { requests, updateRequestStatus } = useRequests();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<string | null>(null);
  
  // Get the request being viewed
  const requestToView = requests.find(request => request.id === viewingRequest);
  
  // Filter for enrollment requests only
  const enrollmentRequests = requests.filter(request => request.type === 'enrollment');
  
  // For approving/rejecting
  const handleReviewRequest = (id: string, status: 'approved' | 'rejected') => {
    if (!user) return;
    
    updateRequestStatus(id, status, user.name);
    
    toast({
      title: status === 'approved' ? 'Enrollment Approved' : 'Enrollment Rejected',
      description: `The enrollment request has been ${status}.`,
    });
    
    logActivity(
      `Enrollment request ${status}`,
      `Enrollment request ID ${id} was ${status === 'approved' ? 'approved' : 'rejected'} by ${user.name}`,
      status === 'approved' ? 'update' : 'delete'
    );
    
    setSelectedRequest(null);
  };
  
  // Open details dialog
  const openDetails = (id: string) => {
    setViewingRequest(id);
  };
  
  // Filter requests by search and status
  const filteredRequests = enrollmentRequests.filter(request => {
    // Filter by search term
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.trainingName && request.trainingName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatusFilter = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    
    return matchesSearch && matchesStatusFilter;
  });
  
  // Count requests by status
  const pendingCount = enrollmentRequests.filter(req => req.status === 'pending').length;
  const approvedCount = enrollmentRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = enrollmentRequests.filter(req => req.status === 'rejected').length;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Enrollment Requests</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedCount}</div>
            <p className="text-sm text-muted-foreground">Enrollments approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{rejectedCount}</div>
            <p className="text-sm text-muted-foreground">Enrollments rejected</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search enrollments..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start">
                      <GraduationCap className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                      <div>
                        {request.trainingName || "Untitled Course"}
                        <p className="text-xs text-gray-500 truncate">{request.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.userName}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        request.status === 'approved' ? 'bg-green-500' :
                        request.status === 'rejected' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openDetails(request.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => setSelectedRequest(request.id)}
                            title="Approve Enrollment"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleReviewRequest(request.id, 'rejected')}
                            title="Reject Enrollment"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No enrollment requests found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Approval Confirmation Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this enrollment request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="success"
              onClick={() => selectedRequest && handleReviewRequest(selectedRequest, 'approved')}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request Details Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrollment Request Details</DialogTitle>
          </DialogHeader>
          
          {requestToView && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{requestToView.title}</h3>
                <Badge
                  className={
                    requestToView.status === 'approved' ? 'bg-green-500' :
                    requestToView.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }
                >
                  {requestToView.status.charAt(0).toUpperCase() + requestToView.status.slice(1)}
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap">{requestToView.description}</p>
              </div>
              
              {requestToView.trainingName && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="font-medium">Course Information</p>
                  <p>{requestToView.trainingName} (ID: {requestToView.trainingId})</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Submitted By</p>
                  <p>{requestToView.userName}</p>
                  <p className="text-gray-500">{requestToView.userEmail}</p>
                </div>
                <div>
                  <p className="font-medium">Submission Date</p>
                  <p>{format(new Date(requestToView.createdAt), 'PPP')}</p>
                  <p className="text-gray-500">{format(new Date(requestToView.createdAt), 'p')}</p>
                </div>
              </div>
              
              {requestToView.reviewedBy && (
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium">Review Information</p>
                  <p>Reviewed by {requestToView.reviewedBy}</p>
                  {requestToView.updatedAt && (
                    <p className="text-gray-500">
                      {format(new Date(requestToView.updatedAt), 'PPP')} at {format(new Date(requestToView.updatedAt), 'p')}
                    </p>
                  )}
                </div>
              )}
              
              {requestToView.status === 'pending' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setViewingRequest(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleReviewRequest(requestToView.id, 'rejected');
                      setViewingRequest(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="success"
                    onClick={() => {
                      handleReviewRequest(requestToView.id, 'approved');
                      setViewingRequest(null);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnrollmentRequestsPage;
