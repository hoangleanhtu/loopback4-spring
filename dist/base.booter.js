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
                await this.modifyClass(cls);
                this.app.add(core_1.createBindingFromClass(cls, {
                    name: cls.name,
                    namespace: constant_1.PREFIX
                }));
            });
        }
    }
    async modifyClass(cls) {
        return cls;
    }
}
exports.BaseBooter = BaseBooter;
//# sourceMappingURL=base.booter.js.map