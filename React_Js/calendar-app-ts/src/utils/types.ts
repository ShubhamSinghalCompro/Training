export type Category = 'All' | 'General' | 'Meeting' | 'Birthday' | 'Anniversary' | 'Important';

export interface Event {
  id: number;
  title: string;
  category: Category;
  color: string;
  date: string;
  startTime: string;
  endTime: string;
}