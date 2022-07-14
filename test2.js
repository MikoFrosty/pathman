let test = 4;

function test2(num) {
    num[0] = 5;
}

test2({test});

console.log(test);