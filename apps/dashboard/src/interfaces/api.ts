export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  token: string;
}

export interface Size {
  id: string;
  size: string;
  type: 'NUMERIC' | 'LETTER';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Color {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  pages: number;
  total: number;
  currentPage: number;
  result: Array<T>;
}
