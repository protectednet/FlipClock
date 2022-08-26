import deepFlatten from './deepFlatten';
import flatten from './flatten';

export type DigitizeOptions = {
    minimumDigits?: number,
    prependLeadingZero?: boolean,
}

/**
 * Digitize a number, string, or an array into a digitized array. This function
 * use by the `Face`, which convert the digitized array into an array of `List`
 * instances.
 *
 * @function digitize
 * @param  {*} value
 * @param  {DigitizeOptions} options
 * @memberof functions
 */
export default function digitize(value: any, options?: DigitizeOptions): string[] {
   const opts = Object.assign({
        minimumDigits: 0,
        prependLeadingZero: true
    }, options);

    function prepend(number) {
        const shouldPrependZero = !!opts.prependLeadingZero
            && number.toString().split('').length === 1;

        return (shouldPrependZero ? '0' : '').concat(number);
    }

    function digits(arr: any[], min: number = 0): string[] {
        const length = deepFlatten(arr).length;

        if(length < min) {
            for(let i = 0; i < min - length; i++) {
                arr[0].unshift('0');
            }
        }

        return flatten(arr);
    }

    return digits(flatten([value]).map(number => {
        return flatten(deepFlatten([number]).map(number => {
            return prepend(number).split('');
        }));
    }), opts.minimumDigits || 0);
}
