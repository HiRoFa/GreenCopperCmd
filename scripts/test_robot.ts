import { Utils as utils } from './utils/utils';
import * as servoMod from './gpio/servo';
import * as robotics from './robotics/robot';

async function initRobot() {

    // init steppers and servos
    let [baseStepper, lowerArmStepper, upperArmStepper] = await utils.awaitAll(
        robotics.Stepper.init('/dev/gpiochip0', 23, 24, 25, 4),
        robotics.Stepper.init('/dev/gpiochip0', 17, 18, 27, 22),
        robotics.Stepper.init('/dev/gpiochip0', 13, 12, 6, 5)
    );

    let servoDriver = new servoMod.SoftPwmDriver("/dev/gpiochip0", 20, servoMod.MG90SServo);
    let gripperServo = new servoMod.Servo(servoDriver);
    await gripperServo.init();

    // create axis with gearReductions
    let baseAxis = new robotics.StepperAxis(baseStepper, 2, null, null, 180);
    let lowerArmAxis = new robotics.StepperAxis(lowerArmStepper, 3, null, null, 90);
    let upperArmAxis = new robotics.StepperAxis(upperArmStepper, 3, null, null, 90);
    let gripperAxis = new robotics.ServoAxis(gripperServo, null, null, 45);

    // create arms with lengths
    let lowerArm = new robotics.Arm(lowerArmAxis, 80);
    let upperArm = new robotics.Arm(upperArmAxis, 80);
    let gripper = new robotics.VGripper(gripperAxis, 40);

    // create robot, with base axis height
    let robot = new robotics.FourAxisRobot(baseAxis, lowerArm, upperArm, gripper, 60);

    return robot;

}

initRobot().then(async (robot) => {
    await robot.zero();
    console.log("robot initialized an zeroed");
    console.log("setting baseAngle to 90");
    await robot.setBaseAngle(90);
    console.log("setting baseAngle to 45");
    await robot.setBaseAngle(45);
    console.log("setting baseAngle to 135");
    await robot.setBaseAngle(135);
    console.log("zeroing");
    await robot.zero();
    console.log("robot zeroed");
});
