import {DefaultCrudRepository} from '@loopback/repository';
import {Customer} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Customer, dataSource);
  }
}
