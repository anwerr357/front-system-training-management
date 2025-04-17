
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Training {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: string;
}

interface TrainingsListProps {
  trainings: Training[];
}

const TrainingsList: React.FC<TrainingsListProps> = ({ trainings }) => {
  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="grid gap-4">
        {trainings.map((training) => (
          <Card key={training.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{training.title}</CardTitle>
              {training.description && (
                <CardDescription>{training.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {training.startDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {new Date(training.startDate).toLocaleDateString()}
                      {training.endDate && ` - ${new Date(training.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                {training.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{training.location}</span>
                  </div>
                )}
                {training.status && (
                  <Badge variant="secondary" className="mt-2">
                    {training.status}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TrainingsList;
