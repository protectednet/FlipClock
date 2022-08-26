import Face from "./Face";
import { call, diff } from "./functions";
import Timer from "./Timer";
import VNode from "./VNode";

export default class FlipClock {
    
    /**
     * The element the count is mounted.
     * 
     * @var {Element}
     */
    public el: Element
    
    /**
     * The face used to display the clock.
     * 
     * @var {Face}
     */
    public face: Face
    
    /**
     * The face value displayed on the clock.
     * 
     * @var {Timer}
     */
    public timer: Timer
    
    /**
     * Instantiate a new clock instance.
     * 
     * @param attributes 
     */
    constructor(
        attributes: Partial<FlipClock> = {}
    ) { 
        if(!attributes.face) {
            throw new Error('You must define a face property.');
        }

        this.face = attributes.face;
        this.face.on('render', () => this.render());
        this.timer = attributes.timer || new Timer(1000);
        
        if(attributes.el) {
            this.mount(attributes.el);
        }
    }

    /**
     * Mount the clock instance to the DOM.
     * 
     * @param {Element} el
     * @returns {this}
     */
    mount(el: Element): this {       
        this.face.beforeMount(this);
        this.el = el;
        this.render();
        this.face.mounted(this);

        if(this.face.autoStart && this.timer.isStopped) {
            window.requestAnimationFrame(() => this.start());
        }

        return this;
    }

    /**
     * Render the clock instance.
     * 
     * @returns {VNode}
     */
    render(): VNode {
        this.face.hook('beforeCreate', this);

        const vnode: VNode = this.face.render();

        this.face.hook('afterCreate', this, vnode);
        
        this.face.hook('beforeAnimation', this, vnode);

        setTimeout(() => {
            diff(vnode, this.el);

            setTimeout(() => {
                this.face.hook('afterRender', this, vnode);
            });
            
            setTimeout(() => {
                this.face.hook('afterAnimation', this, vnode);
            }, this.face.animationRate);
        });

        return vnode;
    }

    /**
     * Start the clock instance.
     *
     * @param  {Function} fn
     * @return {this}
     */
    start(fn?: Function): this {
        this.timer.start(() => {
            this.face.hook('interval', this, fn);

            call(fn);
        });

        this.face.hook('started', this);

        return this;
    }

    /**
     * Stop the clock instance.
     *
     * @param  {Function} fn
     * @return {this}
     */
    stop(fn?: Function): this {
        this.timer.stop(fn);
        this.face.hook('stopped', this);

        return this;
    }

    /**
     * Unmount the clock instance from the DOM.
     */
    unmount() {
        this.face.hook('beforeUnmount', this);
        this.el.parentElement?.removeChild(this.el);
        this.face.resetWatchers();
        this.face.hook('unmounted', this);
    }
}