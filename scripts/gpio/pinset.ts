import * as grecoGpio from 'greco://gpio';

// this class serves as a wrapper for the gpio feature of greco so we  have autcomplete in ts modules etc

export class PinSet {

    private pinSet: grecoGpio.PinSet;

    constructor() {
        this.pinSet = new grecoGpio.PinSet();
    }

    // init

    async init(chipName: string = "/dev/gpiochip0", direction: 'out' | 'in' = 'out', pins: Array<number>): Promise<void> {
        await this.pinSet.init(chipName, direction, pins);
    }

    async softPwmOff(): Promise<void> {
        await this.pinSet.softPwmOff();
    }

    async softPwm(frequency: number, dutyCycle: number, duration?: number): Promise<void> {

        console.log("PinSet.softPwm(%s, %s) duration=%s", frequency, dutyCycle, duration);
        await this.pinSet.softPwm(frequency, dutyCycle);

        if (duration) {
            return new Promise((resolve) => {
                setTimeout(async () => {
                    await this.softPwmOff();
                    resolve();
                }, duration);
            });
        }
    }

    async setState(states: Array<1 | 0>): Promise<void> {
        this.pinSet.setState(states);
    }

    async getState(pinIndex: number): Promise<1 | 0> {
        return await this.pinSet.getState(pinIndex);
    }

    async sequence(
        sequence: Array<Array<1 | 0>>,
        stepDurationMillies: number,
        sequenceRepeats: number
    ): Promise<void> {
        await this.pinSet.sequence(sequence, stepDurationMillies, sequenceRepeats);
    }

}

