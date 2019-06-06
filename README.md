# loopback4-spring
Inspired by [Spring Framework](https://spring.io/):

* @service()
* @transactional()

# Installation

```
npm i -S loopback4-spring
```

# Getting Started

* [Example](./example)

## Register SpringComponent
```typescript
// Import here...
import {SpringComponent} from "loopback4-spring";

export class SpingLikedExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(SpringComponent);
    
    // Other codes...
  }
  
}
```

## Tag your data source as `transactional`
### Relational database
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

### Transaction on MongoDB replica set
```
npm i -S hoangleanhtu/loopback-connector-mongodb
npm i && npm run build
npm run migrate -- --rebuild
```

```typescript
// Import here
import * as config from './mongo.datasource.json';

@bind({
    tags: ['transactional']
})
export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'mongo';

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```
## Create `service` classes
1. Create file with suffix `.service.ts` in folder `src/services`
2. Class name must be suffix by `Service`, e.g: `UserService`, then you can inject repository:

```typescript
// Import here...
export class UserService {

    constructor(
        @repository(UserRepository)
        private userRepository: UserRepository,
        @repository(CustomerRepository)
        private customerRepository: CustomerRepository
    ) {
    }
    
    // Other methods...
}
```

## Apply transaction to method

1. Add `@transactional()` to method
2. Append `options?: Options` to last parameter of method, it's automatically populated by `@transactional()`
3. Pass `options` to repository method

```typescript
// Import here...
import {IsolationLevel, transactional} from "loopback4-spring";

export class UserService {

    constructor(
        @repository(UserRepository)
        private userRepository: UserRepository,
        @repository(CustomerRepository)
        private customerRepository: CustomerRepository
    ) {
    }

    @transactional({isolationLevel: IsolationLevel.READ_COMMITTED})
    async create(
        user: User,
        customer: Customer,
        throwError: boolean,
        options?: Options // Options is populated by @transactional
    ): Promise<{user: User, customer: Customer}> {

        // Must pass options to propagate transaction
        await this.userRepository.create(user, options);
        await this.customerRepository.create(customer, options);

        if (throwError) {
            throw new Error('Error after create user & customer. Transaction is rollback.')
        }

        return {user, customer};
    }
    
    @transactional()
    async callCreateMethod(
        user: User,
        customer: Customer,
        throwError: boolean,
        options?: Object
    ): Promise<{user: User, customer: Customer}> {

        await this.userRepository.create(user, options);
        // Pass options here will propagate transaction as well
        return this.create(user, customer, throwError, options);
    }
}

```

## Inject service in controller
```typescript
// Other imports...
import {service} from "loopback4-spring";

export class UserController {
    constructor(
        @service(UserService)
        private userService: UserService
    ) {
    }
    
    // OpenAPI annotation...
    async createUserAndCustomer(
        @requestBody() userAndCustomer: UserAndCustomer,
        @param.query.boolean('throwError') throwError: boolean = false
    ) {
        const {user, customer} = userAndCustomer;
        return await this.userService.create(user, customer, throwError);
    }
 
    
}
```
