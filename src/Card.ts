import { prop, h } from "./functions";
import CardItem from "./CardItem";
import DomElement from "./types/DomElement";
import VNode from "./VNode";

export default class Card implements DomElement {
    public readonly items: CardItem[];

    constructor(
        protected readonly currentDigit: string,
        protected readonly lastDigit?: string,
        protected readonly animationRate: number = 225
    ) {
        this.items = [
            new CardItem(currentDigit, 'active'),
            new CardItem(prop(lastDigit, currentDigit), 'before')
        ];
    }

    get digit() {
        return this.currentDigit;
    }
    
    render(): VNode {
        return h('div', {
            class: `flip-clock-card ${this.currentDigit !== this.lastDigit ? 'animate' : ''}`,
            style: `animation-delay: ${this.animationRate}ms; animation-duration: ${this.animationRate}ms`
        }, this.items)
    }
}