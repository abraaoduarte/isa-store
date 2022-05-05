require('dotenv-safe').config({
  allowEmptyValues: true,
  path: '.env',
  sample: '.env.example'
});

const env = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  const valueWhenEmpty = defaultValue || '';

  if (typeof value === 'undefined' || value === null) {
    return valueWhenEmpty;
  }

  return value;
};

export default env;
