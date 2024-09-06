
export interface Event {
  id: number;
  title: string;
  category: string;
  color: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Define the RootState interface for TypeScript
export interface RootState {
  events: Event[];
  snackbar: { open: boolean; message: string; color?: 'success' | 'error' | 'warning' | 'info' };
}

export type modalMode = 'view' | 'add' | 'edit' | 'viewEvent';

export interface EventObject{
  title: string;
  category: string;
  color: string;
  startTime: string;
  endTime: string;
}