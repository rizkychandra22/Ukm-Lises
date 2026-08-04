import { route as routeFn } from "ziggy-js";
// @ts-expect-error - Ziggy file might not have type declarations
import { Ziggy } from "../../ziggy";

export function route(name?: string, params?: any, absolute?: boolean): any {
  if (name === undefined) {
    return routeFn(undefined, undefined, undefined, Ziggy);
  }
  return String(routeFn(name as any, params, absolute === undefined ? false : absolute, Ziggy));
}
