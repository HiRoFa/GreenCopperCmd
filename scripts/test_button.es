
let global = this;
// some raw pinset testing
async function test_gpio_in() {
    console.log('init pins');

    let gpio_mod = await import('greco://gpio');

    global.pin_set = new gpio_mod.PinSet();

    await global.pin_set.init('/dev/gpiochip0', 'in', [21, 24]);

    setTimeout(() => {
        console.log("dropping pin_set");
        global.pin_set = null;
        console.log("dropped pin_set, re_init in 5 secs");
        setTimeout(function() {
            test_gpio_in();
        }, 5000);
    }, 10000);

}

console.log("starting");
test_gpio_in().then((r) => {
    console.log("done");
}).catch((ex) => {
    console.error("fail %s", "" + ex);
});
console.log("started");
