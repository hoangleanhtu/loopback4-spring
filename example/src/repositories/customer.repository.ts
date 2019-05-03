import {DefaultCrudRepository} from '@loopback/repository';
import {Customer} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Customer, dataSource);
  }
}
