import concatMap from "./concatMap";

/**
 * Deep flatten an array.
 *
 * @function deepFlatten
 * @param  {array} value - The array to flatten.
 * @return {array} - The flattened array.
 * @memberof functions
 */
export default function deepFlatten(x): string[] {
    return concatMap(x => Array.isArray(x) ? deepFlatten(x) : x)(x);
}