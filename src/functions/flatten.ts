import concatMap from "./concatMap";

/**
 * Flatten an array.
 *
 * @function flatten
 * @param  {array} value - The array to flatten.
 * @return {array} - The flattened array.
 * @memberof functions
 */
export default function flatten(value) {
    return concatMap(value => value)(value)
}