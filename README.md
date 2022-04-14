# GreenCopperCmd

The green_copper_cmd project is a commandline JavaScript interpreter which uses the [GreenCopperRuntime](https://github.com/HiRoFa/GreenCopperRuntime) which is in turn based on [quickjs](https://github.com/bellard/quickjs).

For a list of features that work in script here you should check out the [GreenCopperRuntime](https://github.com/HiRoFa/GreenCopperRuntime) project.

## TypeScript

Supports typescript, you can run .ts files or use .ts modules

## ifdef and env vars

You can use  ifdef and env vars like this

```javascript
#ifdef $GRECO_TEST
   console.log("test mode active") 
#endif
#ifdef $GRECO_RELEASE
   console.log("release mode active") 
#endif
console.log("path = $PATH");
```

## Modules and fetch api

Loading modules from https locations and the fetch api are enabled by default.

## Getting started on Raspberry PI with GPIO

I use this project a lot for GPIO stuff on my Raspberry Pi powered robots, if you connect a Led to GPIO pin 20 this little test should make it blink twice

NB: This project only works on [a 64 bit OS](https://www.raspberrypi.com/news/raspberry-pi-os-64-bit/)!

```bash
git clone https://github.com/HiRoFa/GreenCopperCmd
cd GreenCopperCmd
cargo run -- -f scripts/test_led.ts -i 
```


## commandline options

running with a script

```greco test.ts```

continue running after script has completed (interactive mode)

```greco -i test.ts```

or without using a file

```greco -i'```

verbose mode

```greco -v'```