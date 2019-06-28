"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const loopback_connector_1 = require("loopback-connector");
var IsolationLevel;
(function (IsolationLevel) {
    IsolationLevel["READ_COMMITTED"] = "READ COMMITTED";
    IsolationLevel["READ_UNCOMMITTED"] = "READ UNCOMMITTED";
    IsolationLevel["SERIALIZABLE"] = "SERIALIZABLE";
    IsolationLevel["REPEATABLE_READ"] = "REPEATABLE READ";
})(IsolationLevel = exports.IsolationLevel || (exports.IsolationLevel = {}));
function transactional(spec) {
    // tslint:disable-next-line:no-any
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        // tslint:disable-next-line:no-any
        descriptor.value = async function (...args) {
            // For MongoDB: run transaction with retry
            // @ts-ignore
            async function executeInTransaction(client) {
                async function commitWithRetry(session) {
                    try {
                        await session.commitTransaction();
                    }
                    catch (error) {
                        if (error.errorLabels &&
                            error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
                            await commitWithRetry(session);
                        }
                        else {
                            throw error;
                        }
                    }
                }
                async function runTransactionWithRetry(txnFunc, session) {
                    try {
                        return await txnFunc(session);
                    }
                    catch (error) {
                        // If transient error, retry the whole transaction
                        if (error.errorLabels && error.errorLabels.indexOf('TransientTransactionError') >= 0) {
                            return await runTransactionWithRetry(txnFunc, session);
                        }
                        else {
                            throw error;
                        }
                    }
                }
                async function execute(session) {
                    session.startTransaction(spec);
                    try {
                        const result = await method.apply(self, [
                            ...args,
                            { session, __propagateTx: true }
                        ]);
                        await commitWithRetry(session);
                        return result;
                    }
                    catch (error) {
                        await session.abortTransaction();
                        throw error;
                    }
                }
                const session = client.startSession();
                try {
                    const result = await runTransactionWithRetry(execute, session);
                    session.endSession();
                    return result;
                }
                catch (error) {
                    session.endSession();
                    throw error;
                }
            }
            // @ts-ignore
            const dataSource = this.transactionDataSource;
            // tslint:disable-next-line:no-invalid-this
            const self = this;
            let __propagateTx = false;
            if (args.length > 0 && args[args.length - 1]) {
                __propagateTx = args[args.length - 1].__propagateTx;
            }
            if (!dataSource || __propagateTx) {
                return await method.apply(self, args);
            }
            const connector = dataSource.connector;
            // @ts-ignore
            if (connector.beginTransaction) {
                return await new Promise(((resolve, reject) => {
                    const isolationLevel = spec ? spec.isolationLevel
                        : IsolationLevel.READ_COMMITTED;
                    // @ts-ignore
                    connector.beginTransaction(isolationLevel, async function (error, connectionOrTransaction) {
                        if (error) {
                            return reject(error);
                        }
                        const isTransaction = connectionOrTransaction.connection !== undefined;
                        const transaction = isTransaction ? connectionOrTransaction :
                            new loopback_connector_1.Transaction(connector, connectionOrTransaction);
                        const connection = isTransaction ? connectionOrTransaction.connection :
                            connectionOrTransaction;
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
                                { transaction, __propagateTx: true },
                            ]);
                            // @ts-ignore
                            connector.commit(connection, function (err) {
                                if (err) {
                                    return rollback(err);
                                }
                                resolve(result);
                            });
                        }
                        catch (e) {
                            // @ts-ignore
                            rollback(e);
                        }
                    });
                }));
            }
            else if (connector.name === 'mongodb') {
                // @ts-ignore
                return await executeInTransaction(connector.client);
            }
        };
    };
}
exports.transactional = transactional;
//# sourceMappingURL=transactional.decorator.js.map