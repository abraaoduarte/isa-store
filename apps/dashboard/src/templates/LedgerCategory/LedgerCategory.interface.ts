import { Paginated, LedgerCategory } from 'interfaces/api';

export type PaginatedLedgerCategory = Paginated<LedgerCategory>;

export interface LedgerCategoryTemplateListProps {
  data: PaginatedLedgerCategory;
}

export interface LedgerCategoryFormValues {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface FormLedgerCategoryTemplateProps {
  pageTitle: string;
  ledgerCategoryId?: string;
}
