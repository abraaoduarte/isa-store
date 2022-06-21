import { Brand, Color, ProductCategory, Size } from 'interfaces/api';

export interface ProductTemplateProps {
  pageTitle: string;
  productId?: string;
  brands: Array<Brand>;
  colors: Array<Color>;
  categories: Array<ProductCategory>;
  sizes: Array<Size>;
}
