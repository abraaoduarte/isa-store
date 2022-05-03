import { Model } from 'objection';
import { DBErrors } from 'objection-db-errors';

class BaseModel extends DBErrors(Model) {}

module.exports = BaseModel;
export default BaseModel;
