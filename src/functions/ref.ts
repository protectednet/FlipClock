/**
 * Converts the given value to a reactive subject.
 * 
 * @param {any} value
 * @param {Function[]} events 
 * @returns 
 */
function subject(value: any, events: Function[]): any[]|Object {
    function watch(fn: Function): Function {
        events.push(fn);
    
        return (): void => {
            events.splice(events.indexOf(fn), 1)
        };
    }
    
    if(Array.isArray(value)) {
        class ProxyArray extends Array {
            watch(fn: Function): Function {
                return watch(fn);
            }
        }
        
        return Array.of.call(ProxyArray, ...value);
    }

    return Object.assign(
        Object.create({ watch }), value instanceof Object ? value : { value }
    );
}

/**
 * Create a reactive variable reference.
 * 
 * @param {any} value 
 * @returns {ProxyConstructor}
 */
export default function ref(value: any): ProxyConstructor {
    const events: Function[] = [];

    return new Proxy(subject(value, events), {
        set(target: any, prop: string|symbol, newValue: any) {
            const oldValue = JSON.stringify(target);

            target[prop] = newValue;

            if(JSON.stringify(target) !== oldValue) {
                for(const event of events) {
                    if(Array.isArray(value) || value instanceof Object) {
                        event(target, JSON.parse(oldValue))
                    }
                    else {
                        event(target.value, JSON.parse(oldValue).value)
                    }
                }
            }
            
            return true;
        }
    });
}