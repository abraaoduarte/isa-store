import { Paginated, SellOrder, SellOderCategory } from 'interfaces/api';

export type PaginatedSellOder = Paginated<SellOrder>;

export interface SellOrderTemplateListProps {
  data: PaginatedSellOder;
}

export interface SellOrderFormValues {
  description: string;
  note: string;
  transaction_type: 'DEBIT' | 'CREDIT';
  due_date: Date;
  is_paid: boolean;
  category: string;
  amount: number;
}

export interface FormSellOrderTemplateProps {
  pageTitle: string;
  sellOrderId?: string;
  categories: Array<SellOrderCategory>;
}
