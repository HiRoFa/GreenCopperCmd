async function test() {
    console.log("test");
    let servoMod = await import('https://raw.githubusercontent.com/HiRoFa/GreenCopperRuntime/main/modules/io/gpio/servo.mes');
    console.log("got servo mod");

    let servoDriver = new servoMod.SoftPwmDriver("/dev/gpiochip0", 12, servoMod.MG90SServo);
    console.log("initialized driver");
    let servo = new servoMod.Servo(servoDriver);
    console.log("initialized servo");
    await servo.init();
    console.log("called init");

    console.log("going left");
    await servo.left();
    console.log("going right");
    await servo.right();
    console.log("going left");
    await servo.left();
    console.log("going right");
    await servo.right();
    console.log("going neutral");
    await servo.neutral();
    console.log("going off");
    await servo.off();

};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");

