import { forwardRef } from 'react';
import NumberFormat, { InputAttributes } from 'react-number-format';
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
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalSeparator=","
      thousandSeparator="."
      isNumericString
    />
  );
});

export default NumberFormatCustom;
