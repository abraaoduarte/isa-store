import { forwardRef } from 'react';
import NumberFormat, { InputAttributes } from 'react-number-format';
import { formatNumberToMoney } from 'utils/formatNumberToMoney';
import { NumberFormatCustom } from './NumberField.interface';

const NumberFormatCustom = forwardRef<
  NumberFormat<InputAttributes>,
  NumberFormatCustom
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      format={(number) => {
        return formatNumberToMoney(Number(number));
      }}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      placeholder="0,00"
      decimalSeparator=","
      thousandSeparator="."
      isNumericString
    />
  );
});

export default NumberFormatCustom;
