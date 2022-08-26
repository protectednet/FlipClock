/**
 * Returns a function that returns maps the values before concatenating them.
 *
 * @function concatMap
 * @param  {function} fn - The map callback function.
 * @return {function} - A function that executes the map and concatenation.
 * @memberof functions
 */
export default function concatMap(fn: Function): Function {
    return x => {
        return x.map(fn).reduce((x, y) => x.concat(y), []);
    };
}