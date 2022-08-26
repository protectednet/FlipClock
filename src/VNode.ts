import { diff, render } from './functions';
import type Attributes from './types/Attributes';

export default class VNode {
    tagName: string
    attributes: Attributes = {}
    textContent?: string
    childNodes: VNode[]
    el: Element
    on: Attributes = {}

    constructor(tagName: string, attributes: Attributes = {}, childNodes: VNode[] = []) {
        // Set the tagname as always lowercase.
        this.tagName = tagName.toLowerCase();
        this.childNodes = childNodes;
        this.textContent = undefined;
        
        // Set the propetires and attributes.
        for(const [key, value] of Object.entries(attributes)) {
            if(this.hasOwnProperty(key)) {
                this[key] = value;
            }
            else {
                this.attributes[key] = value;
            }
        }
    }

    render(): Element {
        return this.el = render(this);
    }

    mount(el: Element): void {
        if(!this.el) {
            this.render();
        }

        diff(this, el);
    }
}