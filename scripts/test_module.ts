export function mltpl(a, b) {
    return a * b;
}

export class BaseClass {
    constructor(){
        this.a = 2;
    }
    yup() {
        return this.a;
    }
}

export class SubClass extends BaseClass {
    constructor() {
        super();
        this.a = 1;
    }
}