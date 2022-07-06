import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";

const nodeHTML = {
  floor: `<div class="floor" data-type="floor"></div>`,
  wall: `<div class="wall" data-type="wall"></div>`,
  path: `<div class="path" data-type="path"></div>`,
  trail: `<div class="trail" data-type="trail"></div>`,
  neighbor: `<div class="neighbor" data-type="neighbor"></div>`,
  head: `<div class="head" data-type="head"></div>`,
  start: `<div id="start" data-type="start"></div>`,
  goal: `<div id="goal" data-type="goal"></div>`
}

const searchOptions = {
  speed: 5,
  informed: true
}

// Depth First Search params: field object (field, start, goal), nodeHTML for each type of node, DOM display function, 
// and options (speed & informed search (true/false))
//depthFirstSearch(generateField(nodeHTML, 30, 10), nodeHTML, renderField, searchOptions);
aStarSearch(generateField(nodeHTML, 30, 10), nodeHTML, renderField, searchOptions);


// print field to DOM
function renderField(field) {
  const fieldDisplay = document.querySelector("#field");
  const fieldHTML = field.map((row) => row.join("")).join("<br />");
  fieldDisplay.innerHTML = fieldHTML
  //console.log(fieldHTML); // Used for console testing
}
