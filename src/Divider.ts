import { h } from "./functions";
import ChildNode from "./types/ChildNode";
import DomElement from "./types/DomElement";
import VNode from "./VNode";

export default class Divider implements DomElement {
    constructor(
        protected character: string = ':'
    ) {
        //
    }

    render(): VNode {
        return h('div', {
            class: 'flip-clock-divider'
        }, [
            h('div', {
                class: 'flip-clock-divider-inner'
            }, [this.character])
        ])
    }
}