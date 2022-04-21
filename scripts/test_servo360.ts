async function test() {
    let servoMod = await import('./gpio/servo360');

    let servoDriver = new servoMod.SoftPwm360Driver("/dev/gpiochip0", 24, servoMod.MG995Servo360Model);
    let servo = new servoMod.Servo360(servoDriver);
    await servo.init();

    console.log("slow left");
    await servo.left(5, 1000);
    console.log("slow right");
    await servo.right(5, 1000);

    console.log("25% left");
    await servo.left(25, 1000);
    console.log("25% right");
    await servo.right(25, 1000);

    console.log("max left");
    await servo.left(100, 1000);
    console.log("max right");
    await servo.right(100, 1000);
    await servo.off();

};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");