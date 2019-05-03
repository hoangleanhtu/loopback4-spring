# loopback4-spring
Inspired by [Spring Framework](https://spring.io/):

* @service()
* @transactional()

# Installation

```
npm i -S loopback4-spring
```

# Getting Started

## Tag your data source as `transactional`
```typescript
// Import...

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
```

## Create `service` layer
* Create file with with suffix `.service.ts` in folder `services`
* Class name must be suffix by `Service`, e.g: `UserService`, then you can inject repository:

```typescript


```
