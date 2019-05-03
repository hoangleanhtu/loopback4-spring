import {ArtifactOptions, BaseArtifactBooter, Binding} from '@loopback/boot';
import {Application, Constructor, BindingKey} from "@loopback/core";
import {PREFIX} from "./constant";

export abstract class BaseBooter extends BaseArtifactBooter {
    types: Constructor<object>[];

    protected constructor(protected readonly app: Application,
                          projectRoot: string,
                          options: ArtifactOptions
    ) {
        super(projectRoot, options);
    }

    async load() {
        await super.load();

        this.types = this.classes.filter(this.isTypeClass);

        if (this.types.length > 0) {
            this.types.forEach(async (cls) => {
                const ctor = await this.modifyClass(cls);
                this.app.add(Binding.bind(BindingKey.create(`${PREFIX}.${cls.name}`))
                    .toClass(ctor));
            });
        }
    }

    async modifyClass(cls: Constructor<object>) {
        return cls;
    }

    abstract isTypeClass(cls: Constructor<{}>): boolean;
}
