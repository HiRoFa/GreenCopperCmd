async function initRobot() {
    // import robotics module
    let robotics = await import('https://raw.githubusercontent.com/HiRoFa/robotics/main/robot.mes');

    // init steppers and servos
    let baseStepper = await robotics.Stepper.init('/dev/gpiochip0', [23, 24, 25, 4]);
    let lowerArmStepper = await robotics.Stepper.init('/dev/gpiochip0', [17, 18, 27, 22]);
    let upperArmStepper = await robotics.Stepper.init('/dev/gpiochip0', [13, 12, 6, 5]);
    let gripperServo = new robotics.Servo();//await robotics.Servo.init('/dev/gpiochip0', [20, 26, 16, 19]);

    // create axis with gearReductions
    let baseAxis = new robotics.StepperAxis(baseStepper, 2);
    let lowerArmAxis = new robotics.StepperAxis(lowerArmStepper, 3);
    let upperArmAxis = new robotics.StepperAxis(upperArmStepper, 3);
    let gripperAxis = new robotics.ServoAxis(gripperServo);

    // create arms with lengths
    let lowerArm = new robotics.Arm(lowerArmAxis, 80);
    let upperArm = new robotics.Arm(upperArmAxis, 80);
    let gripper = new robotics.VGripper(gripperAxis, 40);

    // create robot, with base axis height
    let robot = new robotics.FourAxisRobot(baseAxis, lowerArm, upperArm, gripper, 60);

    return robot;

}

initRobot().then((robot) => {
    robot.zero()
    .then(() => {
        console.log("robot initialized an zeroed");
    }).then(() => {
        console.log("setting baseAngle to 90");
        return robot.setBaseAngle(90);
    }).then(() => {
        console.log("setting baseAngle to 45");
        return robot.setBaseAngle(45);
    }).then(() => {
        console.log("setting baseAngle to 135");
        return robot.setBaseAngle(135);
    }).then(() => {
        console.log("zeroing");
        return robot.zero();
    }).then(() => {
        console.log("robot zeroed");
    });

});