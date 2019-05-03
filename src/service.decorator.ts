import {Constructor} from '@loopback/core';
import {nameDecorator} from './spring.component';
import {PREFIX} from "./constant";

export function service(
  name: string | Constructor<object>,
  namespace: string = PREFIX
) {
  const injectName = typeof name === 'string' ? name : name.name;

  return nameDecorator(
    namespace,
    injectName,
    'Class level @service is not implemented'
  );
}
