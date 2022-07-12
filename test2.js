let obj = {
    name: "John",
    age: 30,
    isMarried: false,
    hobbies: ["Sports", "Cooking"]
}

let obj2 = {...obj, age: 31}

console.log({obj, obj2})