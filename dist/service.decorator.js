"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spring_component_1 = require("./spring.component");
const constant_1 = require("./constant");
function service(name, namespace = constant_1.PREFIX) {
    const injectName = typeof name === 'string' ? name : name.name;
    return spring_component_1.nameDecorator(namespace, injectName, 'Class level @service is not implemented');
}
exports.service = service;
//# sourceMappingURL=service.decorator.js.map