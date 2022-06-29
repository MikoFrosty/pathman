const frank = {
    path: [{check: 123}],
    name: 'Frank',
    age: 30
}

let test = frank.path[0];
test.check = 'Franky';
console.log(frank.path)