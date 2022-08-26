import { h } from "./functions";
import DomElement from "./types/DomElement";
import VNode from "./VNode";

export default class CardItem implements DomElement {
    constructor(
        public value: string = '',
        public className: string = ''
    ) {
        //
    }
    
    render(): VNode {
        return h('div', {
            class: `flip-clock-card-item ${this.className}`
        }, [
            h('div', {
                class: 'flip-clock-card-item-inner'
            }, [
                h('div', { class: 'top' }, [this.value]),
                h('div', { class: 'bottom' }, [this.value]),
            ])
        ])
    }
}