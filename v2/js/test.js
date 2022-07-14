// array of objects with two properties: hScore and fScore both are numbers that are ranom between 1 and 200
function getRandomArray(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push({
      fScore: Math.floor(Math.random() * 45) + 1,
      hScore: Math.floor(Math.random() * 45) + 1,
    });
  }
  return arr;
}
const arr = getRandomArray();

//const arr = [99, 100, 101];
//arr.sort((a, b) => b.fScore - a.fScore);
/*arr.sort((a, b) => {
  if (a.fScore === b.fScore) {
    return b.hScore - a.hScore;
  } else {
    return b.fScore - a.fScore;
  }
});
*/
let num = { fScore: 25, hScore: 25, name: "test" };

// This doesn't sort properly in a browser environment and I don't know why
// I've tried to replicate the behavior and initial conditions, but results
// continue to be inconsistent.
// I'm going back to js vanilla sort() function as I've looked it up and it seems like it's O complexity is nearly
// the same as this implementation.
// I've tried a binary type sort option, but it's hard when you are comparing secondary values - especially if more than
// 50% of the primary values being compared are the same.

function pushAndSort(arr, data) {
  if (arr.length === 0) {
    arr.push(data);
  } else {
    let spliced = false;
    for (let i = 0; i < arr.length; i++) {
      if (
        arr[i].fScore > data.fScore ||
        (arr[i].fScore === data.fScore && arr[i].hScore > data.hScore) ||
        (arr[i].fScore === data.fScore && arr[i].hScore === data.hScore)
      ) {
        continue;
      } else {
        arr.splice(i, 0, data);
        spliced = true;
        break;
      }
    }
    if (!spliced) {
      arr.push(data);
    }
  }
}
let counter = 1;
console.log(arr);
getRandomArray(51).forEach(obj => {
    counter ++;
    pushAndSort(arr, obj);
    if (counter % 3 === 0) {
        arr.pop();
    }
});
console.log(arr);

// Create priority queue class
