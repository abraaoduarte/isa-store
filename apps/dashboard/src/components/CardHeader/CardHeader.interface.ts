import { ReactNode } from 'react';

export interface CardHeaderProps {
  onClick?: () => void;
  title: string;
  subHeader: string;
  label?: string;
  iconRight?: ReactNode;
}
