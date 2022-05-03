import Model from './Model';

class User extends Model {
  static tableName = 'users';
  static useSoftDelete = true;

  static booleans = ['is_active'];

  static jsonSchema = {
    type: 'object',
    required: ['email', 'name', 'password'],

    properties: {
      id: { type: 'string' },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string' },
      is_active: { type: 'boolean' },
    },
  };
}

export default User;
