
console.log("start");

import("test_module.ts")
.then((module) => {
    console.log("module was loaded");
    console.log("hello world from test.ts, 5 * 6 = %s", module.mltpl(5, 6));
    let i = new module.SubClass();
    console.log(i.yup());
}).catch((ex) => {
    console.log("failure: " + ex);
});

console.log("end of file");



