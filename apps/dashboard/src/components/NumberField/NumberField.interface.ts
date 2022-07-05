export interface NumberFormatCustom {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
