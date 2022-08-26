import { digitize, prop, ref } from "./functions";

export default class FaceValue {

    /**
     * An array of digits.
     * 
     * @var {ProxyConstructor}
     */
    public readonly digits: ProxyConstructor

    /**
     * The minimum number of digits.
     * 
     * @var {number}
     */
    public readonly minimumDigits: number = 0

    /**
    //  * Prepend the leading zero to a single digit.
    //  * 
    //  * @var {boolean}
    //  */
    // public readonly prependLeadingZero: boolean = true

    /**
     * Instnatiate the face value.
     * 
     * @param {any} value 
     * @param {Attributes} attributes 
     */
    constructor(readonly value: any, attributes: Partial<FaceValue> = {}) {
        const minimumDigits: number = prop(
            attributes.minimumDigits, this.minimumDigits
        );

        this.digits = ref(digitize(prop(value, ''), {
            minimumDigits
        }));

        this.minimumDigits = Math.max(
            this.digits.length, prop(attributes.minimumDigits, this.minimumDigits)
        );

        // this.prependLeadingZero = prop(
        //     attributes.prependLeadingZero, this.prependLeadingZero
        // );
    }

    /**
     * Create a new instance with the given value.
     * 
     * @param {any} value
     * @return {FaceValue}
     */
    copy(value: any): FaceValue {
        return new FaceValue(value, {
            minimumDigits: Math.max(this.minimumDigits, this.digits.length),
            // prependLeadingZero: this.prependLeadingZero
        });
    }


    /**
     * Instantiate a new FaceValue with the given value. If the give value
     * is already an instance of FaceValue, then return the instance.
     * 
     * @param {any} value 
     * @param {Partial<FaceValue>} attributes 
     * @returns {FaceValue}
     */
    static make(value: any, attributes: Partial<FaceValue> = {}): FaceValue {
        if(value instanceof FaceValue) {
            return value;
        }
        
        return new this(value, attributes);
    }
}