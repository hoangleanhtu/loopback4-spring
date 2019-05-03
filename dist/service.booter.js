"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_booter_1 = require("./base.booter");
const core_1 = require("@loopback/core");
const boot_1 = require("@loopback/boot");
const transactional_mixin_1 = require("./transactional.mixin");
let ServiceBooter = class ServiceBooter extends base_booter_1.BaseBooter {
    constructor(app, projectRoot, serviceConfig = {}, dataSources) {
        super(app, projectRoot, 
        // Set DataSource Booter Options if passed in via bootConfig
        Object.assign({}, boot_1.ServiceDefaults, serviceConfig));
        this.app = app;
        this.serviceConfig = serviceConfig;
        this.dataSources = dataSources;
    }
    async modifyClass(cls) {
        const dataSources = await this.dataSources.values();
        if (dataSources.length === 0) {
            throw Error(`Can not find data source for transaction. Must add @bind({tags:['forTransaction']} to data source class`);
        }
        else if (dataSources.length > 1) {
            throw Error(`There must be only @bind({tags:['forTransaction']} data source`);
        }
        return transactional_mixin_1.TransactionalMixin(cls, dataSources[0]);
    }
    isTypeClass(cls) {
        return cls.name.endsWith('Service');
    }
};
ServiceBooter = __decorate([
    __param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, core_1.inject(boot_1.BootBindings.PROJECT_ROOT)),
    __param(2, core_1.inject(`${boot_1.BootBindings.BOOT_OPTIONS}#services`)),
    __param(3, core_1.inject.view(core_1.filterByTag('transactional'))),
    __metadata("design:paramtypes", [core_1.Application, String, Object, core_1.ContextView])
], ServiceBooter);
exports.ServiceBooter = ServiceBooter;
//# sourceMappingURL=service.booter.js.map