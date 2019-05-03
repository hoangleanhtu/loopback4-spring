"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const constant_1 = require("./constant");
class BaseBooter extends boot_1.BaseArtifactBooter {
    constructor(app, projectRoot, options) {
        super(projectRoot, options);
        this.app = app;
    }
    async load() {
        await super.load();
        this.types = this.classes.filter(this.isTypeClass);
        if (this.types.length > 0) {
            this.types.forEach(async (cls) => {
                const ctor = await this.modifyClass(cls);
                this.app.add(boot_1.Binding.bind(core_1.BindingKey.create(`${constant_1.PREFIX}.${cls.name}`))
                    .toClass(ctor));
            });
        }
    }
    async modifyClass(cls) {
        return cls;
    }
}
exports.BaseBooter = BaseBooter;
//# sourceMappingURL=base.booter.js.map