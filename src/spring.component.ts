import {Component, inject} from '@loopback/core';
import {ServiceBooter} from "./service.booter";

export class SpringComponent implements Component {
    booters: any[];

    constructor() {
        this.booters = [
            ServiceBooter
        ];
    }

}

export function nameDecorator(
    namespace: string,
    injectName: string,
    errorMessage: string
) {
    return function(
        target: Object,
        key?: string,
        // tslint:disable-next-line:no-any
        descriptorOrIndex?: TypedPropertyDescriptor<any> | number,
    ) {
        if (key || typeof descriptorOrIndex === 'number') {
            inject(
                `${namespace}.${injectName}`
            )(
                target,
                key!,
                descriptorOrIndex
            );

            return;
        }

        throw new Error(errorMessage);
    }
}
