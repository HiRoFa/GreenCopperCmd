function waitASec(){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 100);
    });
}

async function test(){
    let ledMod = await import('https://raw.githubusercontent.com/HiRoFa/GreenCopperRuntime/main/modules/io/gpio/led.mes');
    let led = await ledMod.Led.init('/dev/gpiochip0', 20);
    for (let x = 0; x < 20; x++) {
        await led.on();
        await waitASec();
        await led.off();
        await waitASec();
    }
};

console.log("starting");
test().then(() => {
    console.log("done");
});
console.log("started");

