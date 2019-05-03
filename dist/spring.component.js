"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const service_booter_1 = require("./service.booter");
class SpringComponent {
    constructor() {
        this.booters = [
            service_booter_1.ServiceBooter
        ];
    }
}
exports.SpringComponent = SpringComponent;
function nameDecorator(namespace, injectName, errorMessage) {
    return function (target, key, 
    // tslint:disable-next-line:no-any
    descriptorOrIndex) {
        if (key || typeof descriptorOrIndex === 'number') {
            core_1.inject(`${namespace}.${injectName}`)(target, key, descriptorOrIndex);
            return;
        }
        throw new Error(errorMessage);
    };
}
exports.nameDecorator = nameDecorator;
//# sourceMappingURL=spring.component.js.map