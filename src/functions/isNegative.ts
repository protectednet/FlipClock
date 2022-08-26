import isNegativeZero from "./isNegativeZero";

/**
 * Determines if a value is a negative.
 *
 * @function isNegative
 * @param  {number} value - The value to check.
 * @return {boolean} - Returns `true` if the value is a negative.
 * @memberof functions
 */
export default function isNegative(value) {
    return isNegativeZero(value) || value < 0;
}