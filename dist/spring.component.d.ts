import { Component } from '@loopback/core';
export declare class SpringComponent implements Component {
    booters: any[];
    constructor();
}
export declare function nameDecorator(namespace: string, injectName: string, errorMessage: string): (target: Object, key?: string | undefined, descriptorOrIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
