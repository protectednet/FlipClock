import Card from '../Card';
import Group from '../Group';
import Face from '../Face';
import FlipClock from '../FlipClock';
import { h, prop } from '../functions';
import VNode from '../VNode';

/**
 * This face is designed to increment and decrement values. Usually this face
 * is used as a counter for 0, 1, 2, 3, 4 (etc) for something like page views.
 * 
 * @extends Face
 * @memberof Faces
 * @example
 * ```html
 * <div id="clock"></div>
 * ```
 * 
 * ```js
 * const instance = new FlipClock({
 *   face: new Counter({
 *     value: new FaceValue(100)
 *   })
 * });
 * 
 * instance.mount(document.querySelector('#clock'));
 * ```
 */
export default class Counter extends Face {

    /**
     * Should the face automatically start on mount.
     * 
     * @var {number}
     */
    autoStart: boolean = false
    
    /**
     * Should the face count down instead of up.
     * 
     * @var {boolean}
     */
    countdown: boolean = false;

    /**
     * The number to increment/decrement in the interval..
     * 
     * @var {number}
     */
    step: number = 1;

    /**
     * Instantiate a Clock face with a given value and attributes.
     * 
     * @param {FaceValue} value 
     * @param {Attributes} attributes
     */
    constructor(
        attributes: Partial<Counter> = {}
    ) {
        super(attributes);

        this.countdown = prop(attributes.countdown, this.countdown);
        this.step = prop(attributes.step, this.step);
    }

    /**
     * Decrement the face value by the given value.
     * 
     * @param {Number} value
     */
    decrement(value?: number) {
        this.value = this.value.copy(
            this.value.value - prop(value, this.step)
        );

        console.log(this.value);
    }

    /**
     * Incremebt the face value by the given value.
     * 
     * @param {Number} value
     */
    increment(value?: number) {
        this.value = this.value.copy(
            this.value.value + prop(value, this.step)
        );

        console.log(this.value);
    }

    /**
     * This method is called with every interval, or every time the clock
     * should change, and handles the actual incrementing and decrementing the
     * clock's `FaceValue`.
     *
     * @param  {FlipClock} instance
     * @return {void}
     */
    interval(instance: FlipClock): void {
        if(this.countdown) {
            this.decrement();
        }
        else {
            this.increment();
        }
    }

    /**
     * Render the clock face.
     * 
     * @return {VNode} 
     */
    render(): VNode {
        const items = this.value.digits.map((digit, i) => new Card(
            digit, this.lastValue && this.lastValue.digits[i]
        ));
        
        return h('div', {
            class: 'flip-clock',
        }, [
            h(new Group({ items }))
        ]);
    }
}
