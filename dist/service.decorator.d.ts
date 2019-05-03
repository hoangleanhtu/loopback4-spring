import { Constructor } from '@loopback/core';
export declare function service(name: string | Constructor<object>, namespace?: string): (target: Object, key?: string | undefined, descriptorOrIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
