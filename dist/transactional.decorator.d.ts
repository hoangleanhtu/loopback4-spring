export interface TransactionalMetaData {
    isolationLevel: IsolationLevel;
}
export declare enum IsolationLevel {
    READ_COMMITTED = "READ COMMITTED",
    READ_UNCOMMITTED = "READ UNCOMMITTED",
    SERIALIZABLE = "SERIALIZABLE",
    REPEATABLE_READ = "REPEATABLE READ"
}
export declare function transactional(spec?: TransactionalMetaData): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
