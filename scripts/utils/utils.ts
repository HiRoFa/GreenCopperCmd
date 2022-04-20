import { Assertions as assert } from './assertions';

export class Utils {

    static "with"(obj) {
        // todo
    }

    static awaitAll(...args) {
        return Promise.all(args.flat());
    }

}