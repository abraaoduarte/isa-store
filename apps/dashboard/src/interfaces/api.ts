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

export interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  brand_id: string;
  product_category_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  size_id: string;
  color_id: string;
  price: number;
  inventory_quantity: number;
  sku: string;
  is_active: boolean;
}

export interface Paginated<T> {
  pages: number;
  total: number;
  currentPage: number;
  result: Array<T>;
}
