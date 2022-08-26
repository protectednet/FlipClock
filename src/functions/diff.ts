import VNode from '../VNode';

/**
 * Bind the events from the vnode to the element.
 * 
 * @param {VNode} vnode 
 * @param {Element} el 
 */
function bindEvents(vnode: VNode, el: Element) {
    for(const [key, value] of Object.entries(vnode.on)) {     
        el.addEventListener(key, value);
    }
}

/**
 * Creates the DOM element from the VNode.
 * 
 * @param {VNode} vnode 
 * @returns {Element}
 */
function createElement(vnode: VNode): Element {
    // Functions to create different types of tags. `element` is the
    // default method used to create tags.
    const tags = {
        'text': (vnode: VNode): Text => document.createTextNode(String(vnode.textContent)),
        'comment': (vnode: VNode): Comment => document.createComment(String(vnode.textContent)),
        'element': (vnode: VNode): Element => document.createElement(vnode.tagName)
    };
    
    return tags[vnode.tagName]
        ? tags[vnode.tagName](vnode)
        : tags['element'](vnode);
}

/**
 * Get the type for a node.
 * 
 * @param {Node} node 
 * @return {string|null}
 */
function getNodeType(node: Node): string|null {
	if (node.nodeType === 3) return 'text';
	if (node.nodeType === 8) return 'comment';
	if (node.nodeType === 11) return 'fragment';
    
    return node instanceof Element
        ? node.tagName.toLowerCase()
        : null;
};

/**
 * Get the contents of a node.
 * 
 * @param {Node} node
 * @return {string|undefined}
 */
function getNodeContent(node: Node|VNode): string|null|undefined {
	if (node.childNodes.length > 0) {
        return;
    }

	return node.textContent;
};

/**
 * Render the VNode as a DOM element.
 * 
 * @param {VNode} vnode
 * @returns {Element}
 * @memberof functions
 */
export function render(vnode: VNode): Element {
    // Create the DOM element
    const el = createElement(vnode);

    // Set the attributes on the element.
    setAttributes(vnode, el);

    // Bind the event listeners
    bindEvents(vnode, el);
    
    // Append the children to the new element
    for(const child of vnode.childNodes) {
        el.appendChild(render(child));
    }

    // Return the new element
    return el;
}

/**
 * Set the attributes from the vnode on the element.
 * 
 * @param {VNode} vnode 
 * @param {Element} el 
 */
function setAttributes(vnode: VNode, el: Element) {
    for(const [key, value] of Object.entries(vnode.attributes)) {
        if(el.getAttribute(key) !== value) {
            el.setAttribute(key, value);
        }
    }
}

/**
 * Sync the attributes from the vnode on the element.
 * 
 * @param {VNode} vnode 
 * @param {Element} el 
 */
function diffAttributes(vnode: VNode, el: Element): void {
    // Set the attributes from the vnode.
    setAttributes(vnode, el);

    // Remove the attributes from the element that aren't on the vnode.
    if(el.attributes) {
        for(const { name } of [...el.attributes]) {
            if(!vnode.attributes[name]) {
                el.removeAttribute(name);
            }
        }
    }
}

/**
 * Determines if the element should be replaced by checking if the tag names
 * do not match, or if the tag names are text.
 * 
 * @param {VNode} vnode 
 * @param {Element} el 
 * @returns {boolean}
 */
function shouldReplaceElement(vnode: VNode, el: Node): boolean {
    return vnode.tagName !== getNodeType(el)
        || vnode.tagName === 'text' && String(vnode.textContent) !== String(el.textContent);
}

/**
 * Diff the VNode and Node and sync the changes with the DOM node.
 * 
 * @param {VNode} vnode 
 * @param {Element} el 
 * @return {VNode}
 * @memberof functions
 */
export function diff(vnode: VNode, el: Node) {
    // If the element is not the same type, replace with the new element.
    // Since the element is replaced, there is no need to do anything.        
    if(shouldReplaceElement(vnode, el)) {
        el.parentNode?.replaceChild(vnode.render(), el);

        return;
    }

    // Sync the attributes from the vnode instance to the dom element.
    if(el instanceof Element) {
        diffAttributes(vnode, el);
    }

    // If extra elements in DOM, remove them. The children of the vnode and the
    // el should match.
    for(let child of [...el.childNodes].slice(vnode.childNodes.length)) {
        el.removeChild(child);
    }
    
    // Loop through the children to recursively run the sync.
    for(let [i, child] of vnode.childNodes.entries()) {
        // If the element doesn't exist, then append it to the parent.
        if(!el.childNodes[i]) {
            el.appendChild(render(child));
    
            continue;
        }

        diff(child, el.childNodes[i]);
    }
}