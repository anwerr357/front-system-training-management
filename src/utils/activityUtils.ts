
import { create } from 'zustand';

export type ActivityType = 'create' | 'update' | 'delete';

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: ActivityType;
  userId: string;
  userName: string;
}

// Simple store to manage recent activities
interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getRecentActivities: (limit?: number) => Activity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [
    {
      id: '1',
      title: 'New training added',
      description: 'Advanced Machine Learning training has been added',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      type: 'create',
      userId: '1',
      userName: 'John Smith'
    },
    {
      id: '2',
      title: 'Training updated',
      description: 'Web Development training has been updated',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      type: 'update',
      userId: '2',
      userName: 'Sarah Adams'
    },
    {
      id: '3',
      title: 'Participant added',
      description: 'New participant David Lee joined Data Science training',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      type: 'create',
      userId: '3',
      userName: 'Emily Chen'
    },
    {
      id: '4',
      title: 'Budget updated',
      description: 'UI/UX Design training budget has been increased',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      type: 'update',
      userId: '1',
      userName: 'John Smith'
    },
    {
      id: '5',
      title: 'Training deleted',
      description: 'Cloud Computing training has been removed',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      type: 'delete',
      userId: '4',
      userName: 'Michael Wong'
    }
  ],
  
  addActivity: (activity) => {
    set((state) => ({
      activities: [{
        ...activity,
        id: String(Date.now()),
        timestamp: new Date()
      }, ...state.activities].slice(0, 50) // Keep only the 50 most recent activities
    }));
  },
  
  getRecentActivities: (limit = 10) => {
    const { activities } = get();
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}));

// Helper function to create and log activity
export const logActivity = (
  title: string,
  description: string,
  type: ActivityType,
  userId: string = '1',
  userName: string = 'Admin User'
) => {
  const { addActivity } = useActivityStore.getState();
  
  addActivity({
    title,
    description,
    type,
    userId,
    userName
  });
};
