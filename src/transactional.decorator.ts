import {DataSource} from '@loopback/repository';
// @ts-ignore
import {Transaction} from 'loopback-connector';

export interface TransactionalMetaData {
    isolationLevel: IsolationLevel;
}

export enum IsolationLevel {
    READ_COMMITTED = 'READ COMMITTED', // default
    READ_UNCOMMITTED = 'READ UNCOMMITTED',
    SERIALIZABLE = 'SERIALIZABLE',
    REPEATABLE_READ = 'REPEATABLE READ',
}

export function transactional(spec?: TransactionalMetaData) {
    // tslint:disable-next-line:no-any
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value!;
        // tslint:disable-next-line:no-any
        descriptor.value = async function (...args: any[]) {
            // @ts-ignore
            const dataSource: DataSource = this.transactionDataSource;
            // tslint:disable-next-line:no-invalid-this
            const self = this;
            const connector = dataSource.connector!;
            return await new Promise(((resolve, reject) => {
                const isolationLevel: IsolationLevel = spec ? spec.isolationLevel : IsolationLevel.READ_COMMITTED;
                // @ts-ignore
                connector.beginTransaction(isolationLevel, async function (error, connection) {
                    if (error) {
                        return reject(error);
                    }

                    // @ts-ignore
                    function rollback(e) {
                        // @ts-ignore
                        connector.rollback(connection, function (err) {
                            if (err) {
                                return reject(err);
                            }

                            reject(e);
                        });
                    }

                    try {
                        const result = await method.apply(self, [...args,
                            {transaction: new Transaction(connector, connection)},
                        ]);
                        // @ts-ignore
                        connector.commit(connection, function (err) {
                            if (err) {
                                return rollback(err);
                            }

                            resolve(result);
                        });
                    } catch (e) {
                        // @ts-ignore
                        rollback(e);
                    }
                });
            }));

        };
    };
}
