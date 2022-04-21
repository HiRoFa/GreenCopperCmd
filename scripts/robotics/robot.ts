import { Assertions as assert } from '../utils/assertions';
import { Utils as utils } from '../utils/utils';
import { Stepper } from '../gpio/stepper';
import { Led } from '../gpio/led';
import { Servo } from '../gpio/servo';
import { Button } from '../gpio/button';

export { Stepper, Led, Servo, Button };

/**
 * abstract base class for all Robots
 **/
export class AbstractRobot {

    constructor() {
        //
    }
    async zero() {
        throw Error("Unimplemented, use a specific Robot class instead");
    }
}

export class FourAxisRobotModel extends AbstractRobot {
    constructor() {
        super();
    }
}

/**
 * a simple 4 axis robot consisting of a rotating base, 2 arms and a Gripper
 **/
export class FourAxisRobot extends AbstractRobot {
    baseAxis: AbstractAxis;
    lowerArm: Arm;
    upperArm: Arm;
    lowerArmHeight: any;
    gripper: Gripper;
    // todo: things like min and max angle per arm, in order to know where it is on zero and calculate target coordinates
    // put that and stuff like armLength in a dedicated Arm class which extends StepperAxis
    constructor(
        baseAxis: AbstractAxis,
        lowerArm: Arm, upperArm: Arm,
        gripper: Gripper,
        lowerArmHeight: number
    ) {
        super();

        assert.is_instance_of(baseAxis, AbstractAxis, "baseAxis should be an instance of AbstractAxis");
        assert.is_instance_of(lowerArm, Arm, "lowerArm should be an instance of Arm");
        assert.is_instance_of(upperArm, Arm, "upperArm should be an instance of Arm");
        assert.is_instance_of(gripper, Gripper, "gripper should be an instance of Gripper");
        assert.is_number(lowerArmHeight, "lowerArmHeight should be a Number (axis center height above ground in mm)");

        this.baseAxis = baseAxis;
        this.lowerArm = lowerArm;
        this.upperArm = upperArm;
        this.gripper = gripper;
        this.lowerArmHeight = lowerArmHeight;
    }

    setZero() {
        this.baseAxis.setZero();
        this.lowerArm.setZero();
        this.upperArm.setZero();
        this.gripper.setZero();
    }

    async zero(): Promise<void> {
        await Promise.all([
            this.baseAxis.zero(),
            this.lowerArm.zero(),
            this.upperArm.zero(),
            this.gripper.zero()
        ]);
    }

    /**
    * move the grip point to a coordinate
    * throws an UnreachableError if position can not be reached
    **/
    async moveTo(x: number, y: number, z: number) {
        await this.zero();

        // movement from zero here, todo add relative position to axis which calculate based on current offset from zero

        // rotate base

        let rad = Math.atan2(x, y); // In radians
        let deg = rad * (180 / Math.PI);

        await Promise.all([
            this.rotateBaseAngle(deg) // todo other 2 movements
        ]);

    }

    /**
    * rotate the base by a number of degrees relative to the current position
    */
    async rotateBaseAngle(angle = 0) {
        assert.is_number(angle, "angle should be a number between -180 and 180");
        assert.is_true(angle => -180 && angle <= 180, "angle should be a number between -180 and 180");

        return this.baseAxis.rotateDegrees(angle);

    }

    /**
    * set the base by a number of degrees relative to the "zero" position
    */
    async setBaseAngle(angle = 0) {
        assert.is_number(angle, "angle should be a number between -180 and 180");
        assert.is_true(angle => -180 && angle <= 180, "angle should be a number between -180 and 180");

        await this.baseAxis.zero();
        await this.baseAxis.rotateDegrees(angle);

    }

    async gripperTo(mm = 0) {
        return this.gripper.openTo(mm);
    }

}

export abstract class AbstractAxis {
    leftEndSwitch: Button;
    rightEndSwitch: Button;
    maxRightAngle: number;
    constructor(leftEndSwitch: Button, rightEndSwitch: Button, maxRightAngle: number) {
        assert.is_instance_of(leftEndSwitch, Button, "leftEndSwitch should be an instance of Button");
        assert.is_instance_of(rightEndSwitch, Button, "rightEndSwitch should be an instance of Button");
        assert.is_number(maxRightAngle, "maxRightAngle should be a Number");

        this.leftEndSwitch = leftEndSwitch;
        this.rightEndSwitch = rightEndSwitch;
        this.maxRightAngle = maxRightAngle;

    }

    abstract rotateDegrees(angle: number): Promise<void>;

    // todo methods like rotate(rotations) / rotate_angle(angle) / step?

    abstract moveToLeftEndSwitch(): Promise<void>;

    abstract moveToRightEndSwitch(): Promise<void>;

    /**
    * set the current position as the "zero" position, the Axis will remember all motion and attempt to reset to this position when zero() is called
    */
    abstract setZero(): void;

    /**
    * return to the "zero" position
    **/
    abstract zero(): Promise<void>;
}

export class StepperAxis extends AbstractAxis {
    stepper: Stepper;
    gearReduction: number;

    constructor(
        stepper: Stepper,
        gearReduction: number,
        leftEndSwitch: null | Button,
        rightEndSwitch: null | Button,
        maxRightAngle: number
    ) {
        super(leftEndSwitch, rightEndSwitch, maxRightAngle);

        assert.is_instance_of(stepper, Stepper, "stepper should be an instance of Stepper");
        assert.is_number(gearReduction, "gearReduction should be a Number");

        this.stepper = stepper;
        this.gearReduction = gearReduction;
    }

    async rotateDegrees(angle: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async moveToLeftEndSwitch() {
        throw Error("NYI");
    }

    async moveToRightEndSwitch() {
        throw Error("NYI");
    }

    setZero() {
        this.stepper.setZero();
    }

    async zero() {
        return this.stepper.zero();
    }
}

export class ServoAxis extends AbstractAxis {
    servo: Servo;

    constructor(servo: Servo, leftEndSwitch, rightEndSwitch, maxRightAngle: number) {
        super(leftEndSwitch, rightEndSwitch, maxRightAngle);
        this.servo = servo;
    }

    rotateDegrees(angle: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async moveToLeftEndSwitch() {
        throw Error("NYI");
    }

    async moveToRightEndSwitch() {
        throw Error("NYI");
    }

    setZero() {
        throw Error("NYI");
    }

    async zero() {
        throw Error("NYI");
    }

}

export class Arm {
    axis: AbstractAxis;
    armLength: number;
    constructor(axis: AbstractAxis, armLength: number) {
        assert.is_true(
            axis instanceof StepperAxis || axis instanceof ServoAxis,
            "axis should be an instance of StepperAxis or ServoAxis"
        );
        this.axis = axis;
        this.armLength = armLength;
    }

    setZero() {
        this.axis.setZero();
    }

    async zero() {
        await this.axis.zero();
    }
}

export class Gripper {
    axis: AbstractAxis;
    constructor(axis: AbstractAxis) {
        assert.is_true(
            axis instanceof StepperAxis || axis instanceof ServoAxis,
            "axis should be an instance of StepperAxis or ServoAxis"
        );
        this.axis = axis;
    }

    async openTo(openingMm = 0) {
        throw Error("Not implemented, use a VGripper or LinearGripper instead");
    }

    async close() {
        await this.openTo(0);
    }

    async open() {
        // move to endSwitch or if none move to open pos

        await this.openTo(10);

    }

    setZero() {
        this.axis.setZero();
    }

    async zero() {
        return this.axis.zero();
    }
}

export class LinearGripper extends Gripper {
    openingMm: number;
    constructor(axis, openingMm: number) {
        super(axis);
        this.openingMm = openingMm;
    }

    async openTo(openingMm = 0) {
        // todo calc based on linear length?
    }
}

export class VGripper extends Gripper {
    armLength: number;
    constructor(axis: AbstractAxis, armLength: number) {
        super(axis);

        assert.is_number(armLength, "armLength should be a number (in mm)");

        this.armLength = armLength;
    }

    async openTo(openingMm = 0) {
        // calculate steps based on steps per rev / armLength
    }

    async open() {
        // run max seqs
    }
}