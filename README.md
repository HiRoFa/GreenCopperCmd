# GreenCopperCmd

The green_copper_cmd project is a commandline JavaScript interpreter which uses the [GreenCopperRuntime](https://github.com/HiRoFa/GreenCopperRuntime) which is in turn based on [quickjs](https://github.com/bellard/quickjs).

For a list of features that work in script here you should check out the [GreenCopperRuntime](https://github.com/HiRoFa/GreenCopperRuntime) project.

## modules and fetch

Loading modules from https locations and the fetch api are enabled by default.

## commandline

running with a script

```greco test.es```

continue running after script has completed (interactive mode)

```greco -i test.es```

or without using a file

```greco -i'```

verbose mode

```greco -v'```