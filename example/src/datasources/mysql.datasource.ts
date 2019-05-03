import {bind, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mysql.datasource.json';

@bind({
    tags: ['transactional']
})
export class MysqlDataSource extends juggler.DataSource {
  static dataSourceName = 'mysql';

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
