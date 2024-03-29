//Het stuurhuis met een mediaan instelpotentiometer (open schaal om de printplaat te zien), debuggen kan hoog zijn, puls is ingesteld op 1,5 ms om het afslaan van het stuurhuis te observeren, als je stopt en de regelpotentiometer inschakelt tot het afslaan zo ver, dus de nul
//De signaalterminal moet worden ingevoerd met een blokgolf van 50 Hz, waarna de duur van de hoge puls, die wordt gebruikt om de signaalcyclus te regelen, de snelheid en de voorwaartse/achterwaartse rotatie en het afslaan kan regelen. De duur van een hoog niveau komt overeen met een snelheid.
//Wanneer het hoge niveau 1 ms - 1,5 ms is, roteert de servo naar voren (de rotatiesnelheid is het snelst wanneer het 1 ms is, hoe hoger hoe lager, de servo stopt met draaien bij het bereiken van 1,5 ms).

import { PinSet } from './gpio/pinset';
import { SoftPwm360Driver } from './gpio/servo360';

/*
import { PinSet } from './scripts/gpio/pinset';
async function softPwm(pinSet: PinSet, frequency: number, dutyCycle: number, duration: number): Promise<void> {
    console.trace("softPwm %s, %s", frequency, dutyCycle);
    pinSet.softPwm(frequency, dutyCycle);
    // todo calc
    return new Promise((resolve, _reject) => {
        setTimeout(resolve, duration);
    });
}

async function test() {

    let pinSet = new PinSet();
    await pinSet.init("/dev/gpiochip0", 'out', [24]);

    // 6.75 - 7.25 is stopped
    // 9.5 is max speed right
    // 4.5 is max speed left
    for (let x = 4.5; x <= 9.5; x += 0.1) {
        console.log("x=%s", x);
        await softPwm(pinSet, 50, x, 500);
        await pinSet.softPwmOff();
    }

};

console.log("starting");
test().then(() => {
    console.log("done");
});
*/

async function test() {
    let servoMod = await import('./gpio/servo360');

    // todo impl a pwm mode with set number of pulses, + transition mode (ease-in-out etc for duty cycle)

    let servoDriver = new servoMod.SoftPwm360Driver("/dev/gpiochip0", 24, servoMod.MG995Servo360Model);
    let servo = new servoMod.Servo360(servoDriver);
    await servo.init();

    console.log("slow left");
    await servo.left(5, undefined, 1000);
    console.log("slow right");
    await servo.right(5, undefined, 1000);

    console.log("25 percent left");
    await servo.left(25, undefined, 1000);
    console.log("25 percent right");
    await servo.right(25, undefined, 1000);

    console.log("max left");
    await servo.left(100, undefined, 1000);
    console.log("max right");
    await servo.right(100, undefined, 1000);
    await servo.off();

    for (let x = 0; x < 10; x++) {
        console.log("200 steps left");
        await servo.left(100, 200);
        console.log("200 steps right");
        await servo.right(100, 200);
        console.log("200 steps left slow");
        await servo.left(10, 200);
        console.log("200 steps right slow");
        await servo.right(10, 200);
    }
};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");