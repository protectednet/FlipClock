import Group from '../Group';
import Face from '../Face';
import { h } from '../functions';
import FlipClock from '../FlipClock';
import VNode from '../VNode';
import FaceValue from '../FaceValue';

/**
 * This face will show a clock in a given format.
 * 
 * @extends Face
 * @memberof Faces
 * @example
 * ```html
 * <div id="clock"></div>
 * ```
 * 
 * ```js
 * import { FlipClock, Clock } from 'flipclock';
 * 
 * const instance = new FlipClock({
 *   face: new Clock({
 *     format: 'hh:mm A'
 *   })
 * });
 * 
 * instance.mount(document.querySelector('#clock'));
 * ```
 */
export default class Clock extends Face {
    
    /**
     * The date format to display.
     * 
     * @var {string}
     */
    format: string = 'HH:mm:ss';

    /**
     * Get the default value if no value is passed.
     * 
     * @param {any} value
     * @returns {FaceValue}
     */
    defaultValue(value: any): FaceValue {
        return new FaceValue(new Date);
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
        
    }

    /**
     * Render the clock face.
     * 
     * @return {VNode} 
     */
    render(): VNode {
        console.log('render', this.value)
        // const items = this.value.digits.map((digit, i) => new Card(
        //     digit, this.lastValue && this.lastValue.digits[i]
        // ));
        
        return h('div', {
            class: 'flip-clock',
        }, [
            h(new Group({  }))
        ]);
    }
}
