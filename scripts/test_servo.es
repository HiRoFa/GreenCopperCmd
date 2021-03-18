async function test(){
    let servoMod = await import('https://raw.githubusercontent.com/HiRoFa/ESsesLib-q/main/modules/io/gpio/servo.mes');

    let frequency = 50;
    let left = 2;
    let neutral = 7;
    let right = 12;

    let servo = await servoMod.Servo.init('/dev/gpiochip0', 12, frequency, left, neutral, right);

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

