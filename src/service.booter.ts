import {BaseBooter} from "./base.booter";
import {Application, CoreBindings, inject, Constructor, filterByTag, ContextView} from "@loopback/core";
import {ArtifactOptions, BootBindings, ServiceDefaults} from "@loopback/boot";
import {DataSource} from "@loopback/repository";
import {TransactionalMixin} from "./transactional.mixin";

export class ServiceBooter extends BaseBooter {

    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE)
        protected app: Application,
        @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
        @inject(`${BootBindings.BOOT_OPTIONS}#services`)
        public serviceConfig: ArtifactOptions = {},
        @inject.view(filterByTag('transactional'))
        private readonly dataSources: ContextView<DataSource>,
    ) {
        super(
            app,
            projectRoot,
            // Set DataSource Booter Options if passed in via bootConfig
            Object.assign({}, ServiceDefaults, serviceConfig),
        );
    }

    async modifyClass(cls: Constructor<object>): Promise<Constructor<object>> {
        const dataSources = await this.dataSources.values();
        if (dataSources.length === 0) {
            throw Error(`Can not find data source for transaction. Must add @bind({tags:['forTransaction']} to data source class`);
        } else if (dataSources.length > 1) {
            throw Error(`There must be only @bind({tags:['forTransaction']} data source`);
        }
        return TransactionalMixin(cls, dataSources[0]);
    }

    isTypeClass(cls: Constructor<{}>): boolean {
        return cls.name.endsWith('Service');
    }
}
