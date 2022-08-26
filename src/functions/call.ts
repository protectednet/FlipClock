/**
 * Check if the function exists and execute the function.
 *
 * @function call
 * @param  {Function} fn
 * @param  {...} args
 * @return {any}
 * @memberof functions
 */
export default function call(fn?: Function, ...args: any): any {
    return fn && fn(...args);
}
