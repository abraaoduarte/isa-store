import { Model, Page, QueryBuilder } from 'objection';
import { DBErrors } from 'objection-db-errors';

class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
    SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
    MaybeSingleQueryBuilderType!: CustomQueryBuilder<M, M | undefined>;
    NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
    PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;
}

class BaseModel extends DBErrors(Model) {
    QueryBuilderType!: CustomQueryBuilder<this>;
    static QueryBuilder = CustomQueryBuilder;
}

module.exports = BaseModel;
export default BaseModel;
