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
  slug: string;
  brand: string;
  discountable: boolean;
  quantity: number;
  category: string;
  description?: string;
  productVariation: {
    uuid?: string;
    inventory_quantity: number;
    sku: string;
    price: number;
    size: string;
    color: string;
    is_active: boolean;
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
