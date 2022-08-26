/**
 * Returns `true` if `undefined or `null`.
 *
 * @function noop
 * @param  {value} string - The value to check.
 * @return {boolean} - `true` if `undefined or `null`.
 * @memberof functions
 */
export default function noop(value) {
    return value !== undefined && value !== null;
}