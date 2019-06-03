import {DefaultCrudRepository} from '@loopback/repository';
import {Customer} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Customer, dataSource);
  }
}
