import * as yup from 'yup';
import { pt } from 'yup-locale-pt';
import { string } from 'yup-locale-pt/lib/locale';

yup.setLocale({
  ...pt,
  string: {
    ...string,
  },
});

export default yup;
