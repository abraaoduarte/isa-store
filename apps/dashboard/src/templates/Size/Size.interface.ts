import { Paginated, Size } from 'interfaces/api';

export type PaginatedSize = Paginated<Size>;

export interface SizeTemplateListProps {
  data: PaginatedSize;
}

export interface SizeFormValues {
  size: string;
  type: string;
  description?: string;
}

export interface FormSizeTemplateProps {
  pageTitle: string;
  sizeId?: string;
}
