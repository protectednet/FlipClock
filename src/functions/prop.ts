/**
 * Treat the value as a prop. If undefined, then used the default value.
 *
 * @function prop
 * @param  {any} value
 * @param  {any} defaultValue
 * @return {any}
 * @memberof functions
 */
export default function prop(value, defaultValue) {
    if(value === undefined) {
        return defaultValue;
    }

    return value;
}