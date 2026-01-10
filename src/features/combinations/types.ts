export interface Combination {
  id: string;
  name: string;
  pairs: [number, number, number];
  createdAt: string;
  group?: string;
  notes?: string;
}

export type SortBy = 'date' | 'name';
