
import { call } from './functions';

export default class Timer {

    /**
     * The count increments with each interval.
     * 
     * @var {number}
     */
    count: number = 0;

    /**
     * The requestAnimationFrame handle number.
     * 
     * @var {number}
     */
    handle: number;

    /**
     * The number of milliseconds that define an interval.
     * 
     * @var {number}
     */
    interval: number = 1000;

    /**
     * The timestamp of the last loop.
     * 
     * @var {number}
     */
    lastLoop: number;

    /**
     * The date the timer starts.
     * 
     * @var {Date}
     */
    started: Date;

    /**
     * The requestAnimationFrame handle number.
     * 
     * @var {boolean}
     */
    running: boolean = false;

    /**
     * Create a new `Timer` instance.
     *
     * @param {number} interval
     */
    constructor(interval: number = 1000) {
        this.interval = interval;
    }

    /**
     * The `elapsed` attribute.
     *
     * @type {number}
     */
    get elapsed(): number {
        if(!this.lastLoop) {
            return 0;
        }

        return this.lastLoop - (this.started || new Date()).getTime();
    }

    /**
     * The `isRunning` attribute.
     *
     * @type {boolean}
     */
    get isRunning(): boolean {
        return this.running === true;
    }

    /**
     * The `isStopped` attribute.
     *
     * @type {boolean}
     */
    get isStopped(): boolean {
        return this.running === false;
    }

    /**
     * Resets the timer.
     *
     * @param  {Function} fn - The interval callback.
     * @return {Timer} - The `Timer` instance.
     */
    reset(fn: Function): Timer {
        this.stop(() => {
            this.count = 0;
            this.start(() => call(fn));
        });

        return this;
    }

    /**
     * Starts the timer.
     *
     * @param  {Function} fn - The interval callback.
     * @return {Timer} - The `Timer` instance.
     */
    start(fn: Function): Timer {
        this.started = new Date;
        this.lastLoop = Date.now();
        this.running = true;

        const loop = () => {
            if(Date.now() - this.lastLoop >= this.interval) {
                call(fn);
                
                this.lastLoop = Date.now();
                this.count++;
            }

            this.handle = window.requestAnimationFrame(loop);

            return this;
        };

        return loop();
    }

    /**
     * Stops the timer.
     *
     * @param  {Function} fn - The stop callback.
     * @return {Timer} - The `Timer` instance.
     */
    stop(fn?: Function): Timer {
        if(this.isRunning) {
            setTimeout(() => {
                window.cancelAnimationFrame(this.handle);

                this.running = false;

                call(fn);
            });
        }

        return this;
    }
}
