import depthFirstSearch from "./turn-left-search.js";
import generateField from "./generate-field.js";

// print field to DOM
function renderField(field) {
  const fieldDisplay = document.getElementById("field");
  const fieldHTML = field.map((row) => row.join("")).join("<br />");
  fieldDisplay.innerHTML = fieldHTML
  //console.log(fieldHTML); // Used for console testing
}

// Depth First Search params: field object (field, start, goal), speed, DOM display function, and smart node sorting
depthFirstSearch(generateField(), 5, renderField, true);
