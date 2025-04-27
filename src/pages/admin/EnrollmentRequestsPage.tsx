import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Request, RequestStatus, useRequests } from '@/hooks/useRequests';
import {useAddParticipantToTraining }from'@/hooks/useParticipants'
import {UpdateRequest} from '@/hooks/useRequests'
const EnrollmentRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate, isPending, isError, error } = useAddParticipantToTraining();  // Fetch requests for each status independently
  const { data: pendingRequests = [] } = useRequests('PENDING');
  const { data: approvedRequests = [] } = useRequests('APPROVED');
  const { data: rejectedRequests = [] } = useRequests('REJECTED');
  const [requestStatus , setRequestStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<string | null>(null);
  
  // Combine all requests for filtering
  const allRequests = [...pendingRequests, ...approvedRequests, ...rejectedRequests];
  
  // Get the request being viewed
  const requestToView = allRequests.find(request => request.id === viewingRequest);
  
  // For approving/rejecting
  const handleReviewRequest = async (id: string, status: any) => {
    if (!user) return;
    const request =allRequests.find(request => request.id === selectedRequest);
    const participantId =  request.userId
    const trainingId = request.trainingId
    // Implement your API call to update the request status
    if(status=='APPROVED'){  
       mutate({trainingId,participantId});
    }
    const updatedRequest = await UpdateRequest(request, status);    
    toast({
      title: status === 'APPROVED' ? 'Enrollment Approved' : 'Enrollment Rejected',
      description: `The enrollment request has been ${status.toLowerCase()}.`,
    });
    
    logActivity(
      `Enrollment request ${status.toLowerCase()}`,
      `Enrollment request ID ${id} was ${status === 'APPROVED' ? 'approved' : 'rejected'} by ${user.name}`,
      status === 'APPROVED' ? 'update' : 'delete'
    );
    
    setSelectedRequest(null);
  };
  
  // Open details dialog
  const openDetails = (id: string) => {
    setViewingRequest(id);
  };
  
  // Filter requests by search and status
  const filteredRequests = allRequests.filter(request => {
    // Filter by search term
    if(request.description==null)request.description='';

    const matchesSearch = 
      request.description?.toLowerCase().includes(searchTerm.toLowerCase()) 
    // Filter by status
    const matchesStatusFilter = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    console.log(matchesSearch && matchesStatusFilter)
    return matchesSearch && matchesStatusFilter;
  });
  
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
            <div className="text-3xl font-bold text-yellow-500">{pendingRequests.length}</div>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedRequests.length}</div>
            <p className="text-sm text-muted-foreground">Enrollments approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{rejectedRequests.length}</div>
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
            onValueChange={(value: 'all' | RequestStatus) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Training ID</TableHead>
              <TableHead>User ID</TableHead>
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
                        {request.trainingId || "Untitled Training"}
                        <p className="text-xs text-gray-500 truncate">{request.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        request.status === 'APPROVED' ? 'bg-green-500' :
                        request.status === 'REJECTED' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
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
                      
                      {request.status === 'PENDING' && (
                        <>
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() =>{ 
                              setRequestStatus('APPROVED')
                              setSelectedRequest(request.id) 
}}
                            title="Approve Enrollment"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setRequestStatus('REJECTED')
                              setSelectedRequest(request.id) 
                             }}
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
            <DialogTitle>Approve Operation</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this request ? This action cannot be undone.
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
              
              onClick={() => selectedRequest && handleReviewRequest(selectedRequest,requestStatus )}
            >
              Yes
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
                <h3 className="text-lg font-semibold">{requestToView.description || "Enrollment Request"}</h3>
                <Badge
                  className={
                    requestToView.status === 'APPROVED' ? 'bg-green-500' :
                    requestToView.status === 'REJECTED' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }
                >
                  {requestToView.status.charAt(0).toUpperCase() + requestToView.status.slice(1).toLowerCase()}
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap">{requestToView.description}</p>
              </div>
              
              {requestToView.trainingId && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="font-medium">Training Information</p>
                  <p>Training ID: {requestToView.trainingId}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Submitted By</p>
                  <p>User ID: {requestToView.userId}</p>
                </div>
                <div>
                  <p className="font-medium">Submission Date</p>
                  <p>{format(new Date(requestToView.requestDate), 'PPP')}</p>
                  <p className="text-gray-500">{format(new Date(requestToView.requestDate), 'p')}</p>
                </div>
              </div>
              
              {requestToView.status !== 'PENDING' && (
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium">Status Information</p>
                  <p>Status: {requestToView.status}</p>
                  <p className="text-gray-500">
                    {format(new Date(requestToView.requestDate), 'PPP')} at {format(new Date(requestToView.requestDate), 'p')}
                  </p>
                </div>
              )}
              
              {requestToView.status === 'PENDING' && (
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
                      handleReviewRequest(requestToView.id, 'REJECTED');
                      setViewingRequest(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="success"
                    onClick={() => {
                      handleReviewRequest(requestToView.id, 'APPROVED');
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