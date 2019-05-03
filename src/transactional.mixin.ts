import {Constructor} from '@loopback/context';
import {DataSource} from '@loopback/repository';

// tslint:disable-next-line:no-any
export function TransactionalMixin<T extends Constructor<object>>(superClass: T, dataSource: DataSource) {
  superClass.prototype.transactionDataSource = dataSource;
  return superClass;
}
