import { Paginated, ProductCategory } from 'interfaces/api';

export type PaginatedProductCategory = Paginated<ProductCategory>;

export interface ProductCategoryTemplateListProps {
  data: PaginatedProductCategory;
}

export interface ProductCategoryFormValues {
  name: string;
  description?: string;
}

export interface FormProductCategoryTemplateProps {
  pageTitle: string;
  productCategoryId?: string;
}
