import { Assertions as assert } from '../utils/assertions';
import { PinSet } from './pinset';

// todo ServoDrivers
// ServoDriver (SoftPwmDriver, PwmDriver, I2C?, AbstractDriverBoardDriver, PCA9685ServoDriver extends AbstractDriverBoardDriver, VirtualServoDriver

/**
* @class ServoModel
* this class defines the parameters of a certain model servo
**/
export class ServoModel {
    frequency: number;
    fullLeftDutyCycle: number;
    neutralDutyCycle: number;
    fullRightDutyCycle: number;
    rangeDegrees: number;
    maxRangeMotionSeconds: number;
    /**
    * Construct a new ServoModel
    * @param {Number} frequency the frequency on which the servo operates in Hz, defaults to 50
    * @param {Number} fullLeftDutyCycle the dutyCycle in percentage which may be used to move the servo to it's full left position
    * @param {Number} neutralDutyCycle the dutyCycle in percentage which may be used to move the servo to it's neutral position
    * @param {Number} fullRightDutyCycle the dutyCycle in percentage which may be used to move the servo to it's full right position
    * @param {Number} rangeDegrees the number of degrees the servo can rotate, defaults to 180
    * @param {Number} maxRangeMotionSeconds the number of seconds it takes the servo to move from full left to full right position, this is used to calculate when motion is actually done
    **/
    constructor(
        frequency: number = 50,
        fullLeftDutyCycle: number = 5,
        neutralDutyCycle: number = 7.5,
        fullRightDutyCycle: number = 10,
        rangeDegrees: number = 180,
        maxRangeMotionSeconds: number = 0.35
    ) {

        assert.is_number(frequency, "frequency should be a positive Number between 0 and 2000");
        assert.is_number(fullLeftDutyCycle, "fullLeftDutyCycle should be a Number between 0 and 100");
        assert.is_number(neutralDutyCycle, "neutralDutyCycle should be a Number between 0 and 100");
        assert.is_number(fullRightDutyCycle, "neutralDutyCycle should be a Number between 0 and 100");
        assert.is_number(rangeDegrees, "rangeDegrees should be a Number between 0 and 360");
        assert.is_number(maxRangeMotionSeconds, "maxRangeMotionSeconds should be a Number between 0 and 10");

        assert.is_lt(frequency, 2001, "frequency should be a Number between 0 and 2000");
        assert.is_gt(frequency, -1, "frequency should be a Number between 0 and 2000");

        assert.is_gt(neutralDutyCycle, -1, "neutralDutyCycle should be a Number between 0 and 100");
        assert.is_lt(neutralDutyCycle, 101, "neutralDutyCycle should be a Number between 0 and 100");

        assert.is_gt(fullLeftDutyCycle, -1, "fullLeftDutyCycle should be a Number between 0 and 100");
        assert.is_lt(fullLeftDutyCycle, neutralDutyCycle, "fullLeftDutyCycle should be a lower Number than neutralDutyCycle");

        assert.is_gt(fullRightDutyCycle, neutralDutyCycle, "fullRightDutyCycle should be a greater Number than neutralDutyCycle");
        assert.is_lt(fullRightDutyCycle, 101, "fullRightDutyCycle should be a Number between 0 and 100");

        assert.is_lt(rangeDegrees, 361, "rangeDegrees should be a Number between 0 and 360");
        assert.is_gt(rangeDegrees, -1, "rangeDegrees should be a Number between 0 and 360");

        assert.is_lt(maxRangeMotionSeconds, 10, "maxRangeMotionSeconds should be a Number between 0 and 10");
        assert.is_gt(maxRangeMotionSeconds, 0, "maxRangeMotionSeconds should be a Number between 0 and 10");

        this.frequency = frequency;
        this.fullLeftDutyCycle = fullLeftDutyCycle;
        this.neutralDutyCycle = neutralDutyCycle;
        this.fullRightDutyCycle = fullRightDutyCycle;
        this.rangeDegrees = rangeDegrees;
        this.maxRangeMotionSeconds = maxRangeMotionSeconds;

    }
}

export const MG90SServo = new ServoModel(50, 2, 7, 12, 180, 0.35);
export const MG995Servo = new ServoModel(50, 2, 7, 12, 180, 0.8);

export class ServoDriver {
    async init() {
        throw Error("unimplemented");
    }

    async left() {
        throw Error("unimplemented");
    }

    async right() {
        throw Error("unimplemented");
    }

    async neutral() {
        throw Error("unimplemented");
    }

    /**
    * move the servo to a certain angle
    * @param {Number} degrees where neutral = 0 and left is a negative number and right is a positive number
    */
    async angle(degrees: number = 0) {
        throw Error("unimplemented");
    }

    async off() {
        throw Error("unimplemented");
    }
}

export class SoftPwmDriver extends ServoDriver {
    servoModel: ServoModel;
    chip: string;
    pinNum: number;
    pinSet: PinSet;

    /**
    * init a new SoftPwmDriver
    * @param {String} chip name of the gpiochip, defaults to /dev/gpiochip0
    * @param {Number} pinNum
    * @param {ServoModel} servoModel
    */
    constructor(chip: string = '/dev/gpiochip0', pinNum: number = 18, servoModel: ServoModel) {
        super();
        assert.is_string(chip, "chip should be a String like \"/dev/gpiochip0\"");
        assert.is_number(pinNum, "pinNum should be a positive Number");
        assert.is_gt(pinNum, -1, "pinNum should be a positive Number");

        assert.is_instance_of(servoModel, ServoModel, "servoModel should be an instance of ServoModel");

        this.servoModel = servoModel;

        this.chip = chip;
        this.pinNum = pinNum;

        this.pinSet = new PinSet();

    }

    async init() {
        await this.pinSet.init(this.chip, 'out', [this.pinNum]);
    }

    async softPwm(frequency: number, dutyCycle: number): Promise<void> {
        console.trace("softPwm %s, %s", frequency, dutyCycle);
        let time = this.servoModel.maxRangeMotionSeconds * 1000;
        await this.pinSet.softPwm(frequency, dutyCycle, undefined, time);
    }

    async left() {
        await this.softPwm(this.servoModel.frequency, this.servoModel.fullLeftDutyCycle);
    }

    async right() {
        await this.softPwm(this.servoModel.frequency, this.servoModel.fullRightDutyCycle);
    }

    async neutral() {
        await this.softPwm(this.servoModel.frequency, this.servoModel.neutralDutyCycle);
    }

    /**
    * move the servo to a certain angle
    * @param {Number} degrees where neutral = 0 and left is a negative number and right is a positive number
    */
    async angle(degrees: number = 0) {
        throw Error("unimplemented");
    }

    async off() {
        await this.pinSet.softPwmOff();
    }
}

/**
* @class Servo
* @description represents an abstract Servo motor which can be positioned
**/
export class Servo {
    driver: ServoDriver;

    /**
    * @constructor
    * @param {ServoDriver} driver the driver to use for this Servo
    */
    constructor(driver: ServoDriver) {
        assert.is_instance_of(driver, ServoDriver, "driver should be an instance of ServoDriver");
        this.driver = driver;
    }

    /**
    * init the servo (or most of the time, it's driver)
    */
    async init() {
        await this.driver.init();
    }

    /**
    * position the Servo in its most left position
    */
    async left() {
        await this.driver.left();
    }

    /**
    * position the Servo in its most right position
    */
    async right() {
        await this.driver.right();
    }

    /**
    * position the Servo in its neutral position
    */
    async neutral() {
        await this.driver.neutral();
    }

    /**
    * move the servo to a certain angle
    * @param {Number} degrees where neutral = 0 and left is a negative number and right is a positive number
    */
    async angle(degrees: number = 0) {
        await this.driver.angle(degrees);
    }

    /**
    * turn of the pwm signal (this will NOT reposition the servo to its neutral position)
    */
    async off() {
        await this.driver.off();
    }
}