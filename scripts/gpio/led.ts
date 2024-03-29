import { Assertions as assert } from '../utils/assertions';
import { PinSet } from './pinset';

export class Led {
    pinSet: PinSet;
    constructor(pinSet: PinSet) {
        this.pinSet = pinSet;
    }

    /**
    * init a new Led
    */
    static async init(chip: string, pinNum: number) {

        assert.is_string(chip, "chip should be a string like '/dev/gpiochip0'");
        assert.is_number(pinNum, "pinNum should be a number");

        let pinSet = new PinSet();
        let instance = new this(pinSet);
        return instance.pinSet.init(chip, 'out', [pinNum])
            .then(() => {
                return instance;
            });
    }

    /**
    * turn the led on
    * @returns Promise<boolean>
    */
    on() {
        return this.pinSet.setState([1]);
    }

    /**
    * turn the led off
    * @returns Promise<boolean>
    */
    off() {
        return this.pinSet.setState([0]);
    }

    /**
    * turn the led on
    * @returns Promise<boolean>
    */
    async is_on() {
        return (await this.pinSet.getState(0)) === 1;
    }

    /**
    * blink the led for a number of seconds
    */
    blink(seconds = 5) {
        assert.is_number(seconds, "seconds should be a number");
        return this.pinSet.sequence([[1], [0], [0], [0]], 250, seconds);
    }
}