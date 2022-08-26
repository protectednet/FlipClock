import diff from '../src/diff';
import VNode from '../src/VNode';

test('if can the timer be started and stopped.', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'test');
    el.setAttribute('class', 'some-class');
    el.innerHTML = '<div>1</div>';

    // el.innerHTML = '<div>1</div><div>2</div><div>3<div>4</div></div>';

    const node: VNode = {
        tagName: 'div',
        children: ['1'],
        attrs: {
            id: 'test',
            class: 'some-class',
        }
    };

    console.log(diff(node, el));
});
