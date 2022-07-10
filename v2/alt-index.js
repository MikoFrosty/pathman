import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";

const searchOptions = {
  speed: 5,
  informed: true,
};

const generateOptions = {
  density: 30,
  size: 10,
};

// start a new field and run aStarSearch on it in a loop until a path is found
(async () => {
  let field = generateField(generateOptions);
  while (await aStarSearch(field, searchOptions) === false) {
    field = generateField(generateOptions);
  }
})();

// Generate new field
//const field = generateField(generateOptions);

// Depth First Search params: field object (field, start, goal), DOM display function,
// and options (speed & informed search (true/false))
//depthFirstSearch(generateField(nodeHTML, 30, 10), nodeHTML, searchOptions);
//aStarSearch(field, searchOptions);