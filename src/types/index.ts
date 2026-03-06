// src/types/index.ts

export type ColumnStatus = 'listed' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  color: string; // e.g., '#FF5733'
  status: ColumnStatus;
}