interface Foo {
    a(a: String);
}

class Test implements Foo {
    a(a: String) {
        return a + "running TypeScript";
    }
}

let t = new Test();
console.log(t.a("i am "));