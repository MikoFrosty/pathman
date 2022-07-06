import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";

// print field to DOM
function renderField(field) {
  const fieldDisplay = document.querySelector("#field");
  const fieldHTML = field.map((row) => row.join("")).join("<br />");
  fieldDisplay.innerHTML = fieldHTML
  //console.log(fieldHTML); // Used for console testing
}

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

// Depth First Search params: field object (field, start, goal), speed, DOM display function, informed search (true/false),
// and nodeHTML for each type of node
depthFirstSearch(generateField(nodeHTML, 30, 10), 5, renderField, true, nodeHTML);
