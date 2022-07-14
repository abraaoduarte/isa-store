import { Paginated, Ledger, LedgerCategory } from 'interfaces/api';

export type PaginatedLedger = Paginated<Ledger>;

export interface LedgerTemplateListProps {
  data: PaginatedLedger;
}

export interface LedgerFormValues {
  description: string;
  note: string;
  transaction_type: 'DEBIT' | 'CREDIT';
  due_date: Date;
  is_paid: boolean;
  category: string;
  amount: number;
}

export interface FormLedgerTemplateProps {
  pageTitle: string;
  ledgerId?: string;
  categories: Array<LedgerCategory>;
}
