import { h } from "./functions";
import Label from "./Label";
import DomElement from "./types/DomElement";
import VNode from "./VNode";

export default class Group implements DomElement {
    public readonly items: any[];

    public readonly label?: string;
    
    constructor(
        attributes: Partial<Group>
    ) {
        this.items = attributes.items || [];
        this.label = attributes.label;
    }
    
    render(): VNode {
        return h('div', {
            class: 'flip-clock-group'
        }, [
            this.label && new Label(this.label),
            h('div', {
                class: 'flip-clock-group-items'
            }, this.items)
        ])
    }
}