async function test() {
    let servoMod = await import('https://raw.githubusercontent.com/HiRoFa/GreenCopperRuntime/main/modules/io/gpio/servo.mes');

    let servoDriver = new servoMod.SoftPwmDriver("/dev/gpiochip0", 12, servoMod.MG90SServo);
    let servo = new servoMod.Servo(servoDriver);
    await servo.init();

    await servo.left();
    await servo.right();
    await servo.left();
    await servo.right();
    await servo.neutral();
    await servo.off();

};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");

