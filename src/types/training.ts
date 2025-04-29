
export interface Training {
  id?: number;
  title: string;
  description?: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  duration: number;
  domainId: number;
  instructorId: number;
  year:number
  budget: number;
  enrolledCount?: number;
  instructorName?: string;
  domainName?: string;
}


export interface TrainingFormData {
  id?:number,
  title: string;
  year:number;
  description?: string;
  startTime: string;
  duration: number;
  domainId: number;
  instructorId: number;
  budget: number;
}
