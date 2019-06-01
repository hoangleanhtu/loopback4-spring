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
            // @ts-ignore
            const dataSource = this.transactionDataSource;
            // tslint:disable-next-line:no-invalid-this
            const self = this;
            if (!dataSource) {
                return await method.apply(self, args);
            }
            const connector = dataSource.connector;
            // @ts-ignore
            if (connector.beginTransaction) {
                return await new Promise(((resolve, reject) => {
                    const isolationLevel = spec ? spec.isolationLevel : IsolationLevel.READ_COMMITTED;
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
                                { transaction: new loopback_connector_1.Transaction(connector, connection) },
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
                const session = connector.client.startSession();
                try {
                    session.startTransaction();
                    const result = await method.apply(self, [...args,
                        { session }
                    ]);
                    await session.commitTransaction();
                    session.endSession();
                    return result;
                }
                catch (e) {
                    await session.abortTransaction();
                    session.endSession();
                    throw e;
                }
            }
        };
    };
}
exports.transactional = transactional;
//# sourceMappingURL=transactional.decorator.js.map