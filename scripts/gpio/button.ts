import {Assertions as assert} from '../utils/assertions.ts';
import {PinSet} from 'greco://gpio';

export class Button {
    constructor(pinSet) {
        this.pinSet = pinSet;
    }

    /**
    * init a new Button
    */
    static async init(chip = '/dev/gpiochip0', pinNum) {
        throw Error("NYI");
    }
}