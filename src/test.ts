import { diff } from "./functions/diff";
import Face from "./Face";
import FaceValue from "./FaceValue";
import Clock from "./faces/Clock";
import Counter from "./faces/Counter";
import ElapsedTime from "./faces/ElapsedTime";
import FlipClock from "./FlipClock";
import h from "./functions/h";
import DomElement from "./types/DomElement";
import VNode from "./VNode";
import Duration from "./Duration";
import { digitize } from "./functions";


export default el => {
    // console.log(new FaceValue(99, {
    //     minimumDigits: 3
    // }));

    // const instance = new FlipClock({
    //     face: new Counter({
    //         value: 99,
    //         step: .25
    //     })
    // });

    // const instance = new FlipClock({
    //     face: new ElapsedTime({
    //         format: 'MM:DD mm:ss',
    //         labels: {
    //             MM: 'Months',
    //             DD: 'Days',
    //             mm: 'Minutes',
    //             ss: 'Seconds'
    //         }
    //     }),
    // });

    const instance = new FlipClock({
        face: new Clock({
            format: 'HH:mm:ss'
        })
    })

    instance.mount(el);
    
    return instance;
}