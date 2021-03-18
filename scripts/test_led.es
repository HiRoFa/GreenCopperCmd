async function test(){
    let ledMod = await import('https://raw.githubusercontent.com/HiRoFa/ESsesLib-q/main/modules/io/gpio/led.mes');
    let led = await ledMod.Led.init('/dev/gpiochip0', 20);
    //await led.blink(5).catch((ex) => {
    //    console.error(ex);
    //});
    await led.on();
    setTimeout(() => {
        console.log("going off");
        led.off();
    }, 1000);
    setTimeout(() => {
        console.log("going on");
        led.on();
    }, 2000);
    setTimeout(() => {
        console.log("going off");
        led.off();
    }, 3000);
};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");

