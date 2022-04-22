import { Assertions as assert } from '../utils/assertions';
import { PinSet } from './pinset';

// NB, todo: this should inherit a lot from Stepper

export class Servo360Model {

    frequency: number;
    maxSpeedDutyCycleLeft: number;
    minSpeedDutyCycleLeft: number;
    maxSpeedDutyCycleRight: number;
    minSpeedDutyCycleRight: number;

    constructor(
        frequency: number,
        maxSpeedDutyCycleLeft: number,
        minSpeedDutyCycleLeft: number,
        maxSpeedDutyCycleRight: number,
        minSpeedDutyCycleRight: number
    ) {

        this.frequency = frequency;
        this.maxSpeedDutyCycleLeft = maxSpeedDutyCycleLeft;
        this.minSpeedDutyCycleLeft = minSpeedDutyCycleLeft;
        this.maxSpeedDutyCycleRight = maxSpeedDutyCycleRight;
        this.minSpeedDutyCycleRight = minSpeedDutyCycleRight;

    }

}

export const MG995Servo360Model = new Servo360Model(50, 4.5, 6.7, 9.5, 7.4);

export type SpeedPercentage = 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100;

export abstract class Servo360Driver {
    abstract init(): Promise<void>

    abstract left(speedPercentage: SpeedPercentage, duration?: number): Promise<void>;
    abstract right(speedPercentage: SpeedPercentage, duration?: number): Promise<void>;

    abstract off(): Promise<void>
}

export class SoftPwm360Driver extends Servo360Driver {

    servoModel: Servo360Model;
    chip: string;
    pinNum: number;

    pinSet: PinSet;

    /**
    * init a new SoftPwmDriver
    * @param {String} chip name of the gpiochip, defaults to /dev/gpiochip0
    * @param {Number} pinNum
    * @param {ServoModel} servoModel
    */
    constructor(chip: string = '/dev/gpiochip0', pinNum: number = 18, servoModel: Servo360Model) {
        super();
        assert.is_string(chip, "chip should be a String like \"/dev/gpiochip0\"");
        assert.is_number(pinNum, "pinNum should be a positive Number");
        assert.is_gt(pinNum, -1, "pinNum should be a positive Number");

        assert.is_instance_of(servoModel, Servo360Model, "servoModel should be an instance of ServoModel");

        this.servoModel = servoModel;

        this.chip = chip;
        this.pinNum = pinNum;

        this.pinSet = new PinSet();

    }

    async init() {
        await this.pinSet.init(this.chip, 'out', [this.pinNum]);
    }

    async right(speedPercentage: SpeedPercentage, duration?: number): Promise<void> {
        let freq = this.servoModel.frequency;
        let dc: number;
        if (speedPercentage === 100) {
            dc = this.servoModel.maxSpeedDutyCycleRight;
        } else if (speedPercentage === 5) {
            dc = this.servoModel.minSpeedDutyCycleRight;
        } else {
            let dif = this.servoModel.maxSpeedDutyCycleRight - this.servoModel.minSpeedDutyCycleRight;
            let part = dif / 95;
            dc = this.servoModel.minSpeedDutyCycleRight + (part * speedPercentage);
        }
        await this.pinSet.softPwm(freq, dc, undefined, duration);

    }

    async left(speedPercentage: SpeedPercentage, duration?: number): Promise<void> {
        let freq = this.servoModel.frequency;
        let dc: number;
        if (speedPercentage === 100) {
            dc = this.servoModel.maxSpeedDutyCycleLeft;
        } else if (speedPercentage === 5) {
            dc = this.servoModel.minSpeedDutyCycleLeft;
        } else {
            let dif = this.servoModel.minSpeedDutyCycleLeft - this.servoModel.maxSpeedDutyCycleLeft;
            let part = dif / 95;
            dc = this.servoModel.minSpeedDutyCycleLeft - (part * speedPercentage);
        }
        await this.pinSet.softPwm(freq, dc, undefined, duration);
    }


    async off() {
        await this.pinSet.softPwmOff();
    }

}

export class Servo360 {
    driver: Servo360Driver;

    /**
     * @constructor
     * @param {ServoDriver} driver the driver to use for this Servo
     */
    constructor(driver: Servo360Driver) {
        assert.is_instance_of(driver, Servo360Driver, "driver should be an instance of Servo360Driver");
        this.driver = driver;
    }

    /**
    * init the servo (or most of the time, it's driver)
    */
    async init() {
        await this.driver.init();
    }

    async right(speedPercentage: SpeedPercentage, duration?: number): Promise<void> {
        await this.driver.right(speedPercentage, duration);
    }
    async left(speedPercentage: SpeedPercentage, duration?: number): Promise<void> {
        await this.driver.left(speedPercentage, duration);
    }
    async off(): Promise<void> {
        await this.driver.off();
    }
}