"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-any
function TransactionalMixin(superClass, dataSource) {
    superClass.prototype.transactionDataSource = dataSource;
    return superClass;
}
exports.TransactionalMixin = TransactionalMixin;
//# sourceMappingURL=transactional.mixin.js.map