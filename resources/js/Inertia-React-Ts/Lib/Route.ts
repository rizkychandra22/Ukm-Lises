import { route as routeFn } from 'ziggy-js';
// @ts-ignore
import { Ziggy } from '../../ziggy';

export function route(name?: string, params?: any, absolute?: boolean): string {
    return String(routeFn(name as any, params, absolute === undefined ? false : absolute, Ziggy));
}