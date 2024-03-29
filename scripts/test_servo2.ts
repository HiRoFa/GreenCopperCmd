async function test() {
    let servoMod = await import('./gpio/servo');

    let servoDriver = new servoMod.SoftPwmDriver("/dev/gpiochip0", 24, servoMod.MG995Servo);
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

