import EmitterEvent from './types/EmitterEvent';

export default class EventEmitter {
    /**
     * The instance events.
     * 
     * @var {EmitterEvent[]}
     */
    protected events: EmitterEvent[] = [];

    /**
     * Emit an event.
     *
     * @param  {string} key
     * @param  {...} key
     * @return {this}
     */
     emit(key: string, ...args) {
        const events: EmitterEvent[] = this.events.filter(
            (e: EmitterEvent) => e.key === key
        );

        for(const event of events) {
            event.fn.apply(this, ...args);
        }

        return this;
    }

    /**
     * Stop listening to for event to fire.
     *
     * @param {string} key
     * @param {(Function|undefined)} fn - The listener callback function. If no
     *     function is defined, all events with the specified id/key will be
     *     removed. Otherwise, only the event listeners matching the id/key AND
     *     callback will be removed.
     * @return {this}
     */
    off(key: string, fn?: (event: EventEmitter) => void) {
        this.events = this.events.filter((e: EmitterEvent) => {
            if(e.key === key && (!fn || fn === e.fn)) {
                
            }
        });
        
        if(this.events[key] && fn) {
            this.events[key] = this.events[key].filter(event => {
                return event !== fn;
            });
        }
        else {
            this.events[key] = [];
        }

        return this;
    }

    /**
     * Start listening for an event to fire.
     *
     * @param  {string} key
     * @param  {Function} fn
     * @param  {boolean} [once=false]
     * @return {this}
     */
    on(key: string, fn: (event: EmitterEvent) => void) {
        this.events.push({ key, fn });

        return this;
    }

    /**
     * Listen form an event to fire once.
     *
     * @param  {string} key
     * @param  {Function} fn - The listener callback function.
     * @return {this}
     */
    once(key, fn) {
        return this.on(key, (...args) => {
            fn(...args);

            this.off(key, fn);
        });
    }

}