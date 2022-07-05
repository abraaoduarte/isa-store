import {
  Brand,
  Color,
  Paginated,
  Product,
  ProductCategory,
  Size,
} from 'interfaces/api';

export type PaginatedProduct = Paginated<Product>;

export interface ProductTemplateListProps {
  data: PaginatedProduct;
}

export interface ProductFormValues {
  name: string;
  brand: string;
  price: number;
  discount: number;
  quantity: number;
  category: string;
  description?: string;
  productVariation: {
    quantity: number;
    size: string;
    color: string;
  }[];
}

export interface FormProductTemplateProps {
  pageTitle: string;
  productId?: string;
  brands: Array<Brand>;
  colors: Array<Color>;
  categories: Array<ProductCategory>;
  sizes: Array<Size>;
}
