
export interface Training {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  duration: number;
  domainId: number;
  instructorId: number;
  budget: number;
  enrolledCount?: number;
  instructorName?: string;
  domainName?: string;
}

export interface TrainingFormData {
  title: string;
  description?: string;
  startDate: string;
  startTime: string;
  duration: number;
  domainId: number;
  instructorId: number;
  budget: number;
}
