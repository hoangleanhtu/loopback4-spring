import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(User, dataSource);
  }
}
