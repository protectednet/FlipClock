/**
 * Determines if a value is a negative zero.
 *
 * @function isNegativeZero
 * @param  {number} value - The value to check.
 * @return {boolean} - Returns `true` if the value is a negative zero (`-0`).
 * @memberof functions
 */
export default function isNegativeZero(value) {
    return 1 / Math.round(value) === -Infinity;
}