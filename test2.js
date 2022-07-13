function test() {
    for (var i = 0; i < 100000; i++) {
    }
    console.log("test done");
}

function test2() {
    for (var i = 0; i < 100000; i++) {
        if (i === 99999) {
            console.log("i = " + i);
        }
    }
    console.log("test 2 done");
}

test();
test2();
test();
test2();