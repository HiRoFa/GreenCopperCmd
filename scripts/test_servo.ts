/*
 (async () => {
        let pinSetMod = await import("./scripts/gpio/pinset");
        let pinSet = new pinSetMod.PinSet();
        await pinSet.init('/dev/gpiochip0', 'out', [12]);
        await pinSet.softPwm(50, 5, 500);
        await pinSet.softPwm(50, 10, 500);

*/

async function test() {
    let servoMod = await import('./gpio/servo');

    let servoDriver = new servoMod.SoftPwmDriver("/dev/gpiochip0", 21, servoMod.MG90SServo);
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

