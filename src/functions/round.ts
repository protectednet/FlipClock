import isNegative from "./isNegative";
import isNegativeZero from "./isNegativeZero";

/**
 * Round the value to the correct value. Takes into account negative numbers.
 *
 * @function round
 * @param  {value} string - The value to round.
 * @return {string} - The rounded value.
 * @memberof functions
 */
export default function round(value) {
    return isNegativeZero(
        value = isNegative(value) ? Math.ceil(value) : Math.floor(value)
    ) ? ('-' + value).toString() : value;
}