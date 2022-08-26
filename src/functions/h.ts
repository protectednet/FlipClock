import Attributes from '../types/Attributes';
import ChildNode from '../types/ChildNode';
import DomElement from '../types/DomElement';
import VNode from '../VNode';


const pattern: RegExp = /<!--(.+?)-->/gim;

function isComment(str:string): boolean {
    return !!str.match(pattern);
}

function isDomElement(object: any): object is DomElement {
    return typeof object === 'object' && 'render' in object;
}

/**
 * Create a VNode.
 * 
 * @param {string} tagName 
 * @param {Attributes|ChildNode[]|ChildNode} attrs 
 * @param {ChildNode[]} children 
 * @returns {VNode}
 */
export default function h(tagName: string|DomElement, attrs?: Attributes|(ChildNode|undefined)[]|ChildNode, children?: (ChildNode|undefined)[]): VNode {
    // If the tagName is a DomElement, then render and return it.
    if(isDomElement(tagName)) {
        const vnode: VNode = tagName.render();
        
        // merge(vnode.attributes, attrs);

        return vnode;
    }

    // If attrs is an array, then assume it to be children
    if(Array.isArray(attrs)) {
        children = attrs;
        attrs = {};
    }

    // If the attrs are not an object, assume it to be a text node.
    if(attrs && !(attrs instanceof Object)) {
        children = [attrs]
    }

    // Create the new Vnode and recursively create its children.
    return new VNode(tagName, <Attributes> attrs, children?.filter(child => child !== undefined).map(textContent => {
        if(textContent instanceof VNode) {
            return textContent;
        }

        if(isDomElement(textContent)) {
            return textContent.render();
        }

        if(isComment(String(textContent))) {
            return h('comment', {
                textContent: String(textContent).replace(pattern, '$1')
            });
        }

        return h('text', {textContent});
    }));
}