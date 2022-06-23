import { Paginated, Color } from 'interfaces/api';

export type PaginatedColor = Paginated<Color>;

export interface ColorTemplateListProps {
  data: PaginatedColor;
}

export interface ColorFormValues {
  name: string;
}

export interface FormColorTemplateProps {
  pageTitle: string;
  colorId?: string;
}
