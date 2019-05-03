import { Constructor } from '@loopback/context';
import { DataSource } from '@loopback/repository';
export declare function TransactionalMixin<T extends Constructor<object>>(superClass: T, dataSource: DataSource): T;
