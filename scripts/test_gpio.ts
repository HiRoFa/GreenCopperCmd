{
    // test a stepper motor
    async function test_stepper() {
        // load the Stepper class
        let stepperMod = await import('./gpio/stepper');
        // init a Stepper
        let myStepper = await stepperMod.Stepper.init('/dev/gpiochip0', 23, 24, 25, 4);
        // do 10 steps, forward, 2ms delay, HALF step sequence
        await myStepper.step(200, true, 2, stepperMod.Stepper.HALF_STEP);
        // rotate 90 degrees left, 2ms delay, DOUBLE_STEP sequence
        await myStepper.rotateDegrees(-90, 3, stepperMod.Stepper.DOUBLE_STEP);
        // rotate 3 revolutions forward, 2ms delay, SINGLE_STEP sequence
        await myStepper.rotate(3, true, 2, stepperMod.Stepper.SINGLE_STEP);
    }


    // leds = 17, 18, 27, 22;

    // led testing
    async function test_led() {
        // load the Led class
        let ledMod = await import('./gpio/led');
        // init an Led
        let myLed = await ledMod.Led.init('/dev/gpiochip0', 17);
        // blink for 5 seconds
        await myLed.blink(5);
    }



    // some raw pinset testing
    async function test_gpio() {
        console.log('init pins');

        let gpio_mod = await import('./gpio/pinset');

        let pin_set2 = new gpio_mod.PinSet();

        await pin_set2.init('/dev/gpiochip0', 'out', [23, 24, 25, 4]);

        console.log('setting states 2 to 1');
        await pin_set2.setState([1, 1, 1, 1]);

        console.log('running sequence');
        await pin_set2.sequence([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], 2, 1000);

    }

    // run test sequence

    test_stepper().then(() => {
        console.log("test_stepper test done");
        return test_led();
    }).then(() => {
        console.log("test_led test done");
        return test_gpio();
    }).then(() => {
        console.log('test_gpio done');
    }).catch((ex) => {
        console.error('test failed: %s', '' + ex);
    });

}