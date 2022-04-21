import { Assertions as assert } from './assertions';

export class Utils {

    static "with"(obj) {
        // todo
    }

    static awaitAll<T>(...args: Array<Promise<T>>): Promise<Array<T>> {
        return Promise.all(args);
    }

}