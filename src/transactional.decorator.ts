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

export function transactional(spec?: TransactionalMetaData | Object) {
    // tslint:disable-next-line:no-any
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value!;
        // tslint:disable-next-line:no-any
        descriptor.value = async function (...args: any[]) {
            // For MongoDB: run transaction with retry
            // @ts-ignore
            async function executeInTransaction(client: any) {

                async function commitWithRetry(session: any) {
                    try {
                        await session.commitTransaction();
                    } catch (error) {
                        if (
                            error.errorLabels &&
                            error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
                        ) {
                            await commitWithRetry(session);
                        } else {
                            throw error;
                        }
                    }
                }

                async function runTransactionWithRetry(txnFunc: Function, session: any): Promise<any> {
                    try {
                        return await txnFunc(session);
                    } catch (error) {
                        // If transient error, retry the whole transaction
                        if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
                            return await runTransactionWithRetry(txnFunc, session);
                        } else {
                            throw error;
                        }
                    }
                }

                async function execute(session: any) {
                    session.startTransaction(spec);
                    const result = await method.apply(self, [
                        ...args,
                        {session}
                    ]);
                    try {
                        await commitWithRetry(session);
                        return result;
                    } catch (error) {
                        await session.abortTransaction();
                        throw error;
                    }
                }

                const session = client.startSession();
                try {
                    const result = await runTransactionWithRetry(execute, session);
                    session.endSession();
                    return result;
                } catch (error) {
                    session.endSession();
                    throw error;
                }
            }
            // @ts-ignore
            const dataSource: DataSource = this.transactionDataSource;
            // tslint:disable-next-line:no-invalid-this
            const self = this;

            if (!dataSource) {
                return await method.apply(self, args);
            }

            const connector = dataSource.connector!;
            // @ts-ignore
            if (connector.beginTransaction) {
                return await new Promise(((resolve, reject) => {
                    const isolationLevel: IsolationLevel = spec ? (<TransactionalMetaData>spec).isolationLevel : IsolationLevel.READ_COMMITTED;
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
            } else if (connector.name === 'mongodb') {
                // @ts-ignore
                return await executeInTransaction(connector.client);
            }

        };
    };
}
