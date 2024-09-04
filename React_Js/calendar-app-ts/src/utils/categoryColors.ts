import { Category } from '../utils/types';

export const categoryColors: Record<Category, string> = {
  All:        '#00000000',  // transparent  
  General:    'rgba(0, 128, 255, 0.2)',  // Soft Blue
  Meeting:    'rgba(0, 128, 128, 0.2)',  // Soft Teal
  Birthday:   'rgba(255, 165, 0, 0.2)',  // Soft Orange
  Anniversary:'rgba(128, 0, 128, 0.2)',  // Soft Purple
  Important:  'rgba(60, 179, 113, 0.2)', // Soft Green
};
