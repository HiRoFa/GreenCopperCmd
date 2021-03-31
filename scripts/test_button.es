
let pin_set;
// some raw pinset testing
async function test_gpio_in() {
    console.log('init pins');

    let gpio_mod = await import('greco://gpio');

    pin_set = new gpio_mod.PinSet();

    await pin_set.init('/dev/gpiochip0', 'in', [21, 24]);

}

console.log("starting");
test_gpio_in().then((r) => {
    console.log("done");
}).catch((ex) => {
    console.error("fail %s", "" + ex);
});
console.log("started");
