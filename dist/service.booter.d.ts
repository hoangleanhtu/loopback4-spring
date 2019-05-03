import { BaseBooter } from "./base.booter";
import { Application, Constructor, ContextView } from "@loopback/core";
import { ArtifactOptions } from "@loopback/boot";
import { DataSource } from "@loopback/repository";
export declare class ServiceBooter extends BaseBooter {
    protected app: Application;
    serviceConfig: ArtifactOptions;
    private readonly dataSources;
    constructor(app: Application, projectRoot: string, serviceConfig: ArtifactOptions, dataSources: ContextView<DataSource>);
    modifyClass(cls: Constructor<object>): Promise<Constructor<object>>;
    isTypeClass(cls: Constructor<{}>): boolean;
}
