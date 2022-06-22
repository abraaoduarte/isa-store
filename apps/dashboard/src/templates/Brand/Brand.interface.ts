import { Brand, Paginated } from 'interfaces/api';

export type PaginatedBrand = Paginated<Brand>;

export interface BrandTemplateProps {
  data: PaginatedBrand;
}

export interface BrandFormValues {
  name: string;
  type: string;
  description?: string;
}

export interface FormBrandTemplateProps {
  pageTitle: string;
  brandId?: string;
}
