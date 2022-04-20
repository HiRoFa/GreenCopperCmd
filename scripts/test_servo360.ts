//Het stuurhuis met een mediaan instelpotentiometer (open schaal om de printplaat te zien), debuggen kan hoog zijn, puls is ingesteld op 1,5 ms om het afslaan van het stuurhuis te observeren, als je stopt en de regelpotentiometer inschakelt tot het afslaan zo ver, dus de nul
//De signaalterminal moet worden ingevoerd met een blokgolf van 50 Hz, waarna de duur van de hoge puls, die wordt gebruikt om de signaalcyclus te regelen, de snelheid en de voorwaartse/achterwaartse rotatie en het afslaan kan regelen. De duur van een hoog niveau komt overeen met een snelheid.
//Wanneer het hoge niveau 1 ms - 1,5 ms is, roteert de servo naar voren (de rotatiesnelheid is het snelst wanneer het 1 ms is, hoe hoger hoe lager, de servo stopt met draaien bij het bereiken van 1,5 ms).

import { PinSet } from 'greco://gpio';

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

    for (let x = 1; x < 4; x += 0.1) {
        console.log("x=%s", x);
        await softPwm(pinSet, 50, x, 1000);
        await pinSet.softPwmOff();
    }



};

console.log("starting");
test().then(() => {
    console.log("done");
});