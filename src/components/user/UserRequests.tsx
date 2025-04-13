
import React from 'react';
import { useRequests } from "@/contexts/RequestsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

const UserRequests: React.FC = () => {
  const { userRequests } = useRequests();
  
  if (userRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't submitted any requests yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{request.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Badge
                  className={
                    request.status === 'approved' ? 'bg-green-500' :
                    request.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm mb-2">{request.description}</p>
              <div className="text-xs text-gray-500">
                {request.status !== 'pending' && request.reviewedBy && (
                  <p>Reviewed by {request.reviewedBy} {request.updatedAt && formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRequests;
