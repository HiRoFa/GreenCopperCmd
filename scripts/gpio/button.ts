import { Assertions as assert } from '../utils/assertions';
import { PinSet } from './pinset';

export class Button {
    pinSet: PinSet;
    constructor(pinSet: PinSet) {
        this.pinSet = pinSet;
    }

    /**
    * init a new Button
    */
    static async init(chip = '/dev/gpiochip0', pinNum) {
        throw Error("NYI");
    }
}