import Card from '../Card';
import Divider from '../Divider';
import Duration from '../Duration';
import Face from '../Face';
import FaceValue from '../FaceValue';
import FlipClock from '../FlipClock';
import { prop, h, digitize } from '../functions';
import Group from '../Group';
import Attributes from '../types/Attributes';
import VNode from '../VNode';

/**
 * The flag regex pattern.
 * 
 * @var {RegExp}
 */
const pattern: RegExp = /[^\w]+/;
        
/**
 * This face will show the amount of time elapsed since the given value and
 * display it a specific format. For example 'hh:mm:ss' will show the elapsed
 * time in hours, minutes, seconds.
 * 
 * @extends Face
 * @memberof Faces * 
 * @example
 * ```html
 * <div id="clock"></div>
 * ```
 * 
 * ```js
 * const instance = new FlipClock({
 *   face: new ElapsedTime({
 *      format: 'hh:mm:ss'
 *   })
 * });
 * 
 * instance.mount(document.querySelector('#clock'));
 * ```
 */
export default class ElapsedTime extends Face {

    /**
     * Should the face count down instead of up.
     * 
     * @var {boolean}
     */
    countdown: boolean = false;
    
    /**
     * The date format to display.
     * 
     * @var {string}
     */
    format: string = 'mm:ss';    

    /**
     * Show the labels on the clock face.
     * 
     * @var {string[]|Function}
     */
    labels: Attributes|Function = [];

    /**
     * The starting date used to calculate the elsapsed time.
     * 
     * @var {Date}
     */
    start: Date;

    /**
     * Instantiate a Clock face with a given value and attributes.
     * 
     * @param {FaceValue} value 
     * @param {Attributes} attributes
     */
    constructor(
        attributes: Partial<ElapsedTime> = {}
    ) {
        super(attributes);

        this.format = prop(attributes.format, this.format);
        this.labels = prop(attributes.labels, this.labels);
        this.start = prop(attributes.start, new Date);
    }

    /**
     * Get the default value if no value is passed.
     * 
     * @param {any} value
     * @returns {FaceValue}
     */
    defaultValue(value: any): FaceValue {
        return super.defaultValue(value || new Date);
    }

    /**
     * Decrement the face value by the given value.
     * 
     * @param {Number} value
     * @return {this}
     */
    decrement(value: number = 1000): this {
        this.value = this.value.copy(
            new Date(this.value.value.getTime() - value)
        );

        return this;
    }

    /**
     * Increment the face value by the given value.
     * 
     * @param {Number} value
     * @return {this}
     */
    increment(value: number = 1000): this {
        this.value = this.value.copy(
            new Date(this.value.value.getTime() + value)
        );

        return this;
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
            this.decrement(new Date().getTime() - instance.timer.lastLoop);
        }
        else {
            this.increment(new Date().getTime() - instance.timer.lastLoop);
        }
    }

    /**
     * Render the clock face.
     * 
     * @return {VNode} 
     */
    render(): VNode {
        return h('div', { class: 'flip-clock' }, this.createGroups(
            this.state.value, this.createGroups(this.prevState?.value)
        ));
    }

    /**
     * Create the groups from the given FaceValue.
     * 
     * @param {FaceValue} value 
     * @param {Group[]} prevGroups 
     * @returns {Group[]}
     */
    protected createGroups(value?: FaceValue, prevGroups: Group[] = []): Group[] {
        if(!value) {
            return [];
        }

        return new Duration(this.start, value?.value)
            .format(this.format)
            .split(/\s+/)
            .map((subject: string, x: number) => new Group({
                items: this.createGroup(subject, x, prevGroups)
            }));
    }

    /**
     * Create the groups from given string.
     * 
     * @param {string} subject
     * @param {number} x
     * @param {Group[]} prevGroups 
     * @returns {(Group|Divider)[]}
     */
    protected createGroup(subject: string, x: number, prevGroups: Group[] = []): (Group|Divider)[] {
        const digits: string[] = subject.match(pattern) || [];

        const flagGroups: string[] = this.format.split(/\s+/);

        const parts: any[] = subject.split(pattern).map(group => {
            return digitize(group);
        });
        
        for(let i = 0; i < parts.length - 1; i+=2) {
            parts.splice(i + 1, 0, new Divider(digits[i]));
        }
        
        let offset: number = 0;

        return parts.map((part, y) => {
            // If the part is a Divider, then add to the offset and return the
            // divider. The offset counts the dividers so the index of the flag
            // can be determined.
            if(part instanceof Divider) {
                offset++;

                return part;
            }

            // Split the flag group using the pattern to match dividers.
            const flagGroup: string[] = flagGroups[x]?.split(pattern);

            // From the flag group, use the offset to get the current flag
            const flag: string = flagGroup[y - offset];

            // Creat the group using the label glag and items.
            return new Group({
                label: this.labels[flag],
                items: part.map((digit, z) => {
                    return new Card(digit, (<Card>(<Group>prevGroups[x]?.items[y])?.items[z])?.digit)
                })
            })
        });
    }
}
