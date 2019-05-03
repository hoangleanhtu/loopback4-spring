import { ArtifactOptions, BaseArtifactBooter } from '@loopback/boot';
import { Application, Constructor } from "@loopback/core";
export declare abstract class BaseBooter extends BaseArtifactBooter {
    protected readonly app: Application;
    types: Constructor<object>[];
    protected constructor(app: Application, projectRoot: string, options: ArtifactOptions);
    load(): Promise<void>;
    modifyClass(cls: Constructor<object>): Promise<Constructor<object>>;
    abstract isTypeClass(cls: Constructor<{}>): boolean;
}
