import { h } from "./functions";
import DomElement from "./types/DomElement";
import VNode from "./VNode";

export default class Label implements DomElement {
    constructor(
        public readonly text: string
    ) {
        //
    }
    
    render(): VNode {
        return h('div', {
            class: 'flip-clock-label'
        }, [this.text])
    }
}