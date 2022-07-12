import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";
import dom, { nodeHoverStats } from "./dom.js";

const searchOptions = {
  speed: 9,
  informed: true,
  output: dom.out1,
};
const genOptions = {
  density: 30,
  size: 1,
};

let field = generateField(genOptions);

// Breadth First
findPath(field, aStarSearch, {
  searchOptions: { ...searchOptions, informed: false, output: dom.out1 },
  genOptions,
  once: true,
});
// Depth First
findPath(field, depthFirstSearch, {
  searchOptions: { ...searchOptions, informed: false, output: dom.out2 },
  genOptions,
  once: true,
});
// A*
findPath(field, aStarSearch, {
  searchOptions: { ...searchOptions, informed: true, output: dom.out3 },
  genOptions,
  once: true,
});
// Best Depth First
findPath(field, depthFirstSearch, {
  searchOptions: { ...searchOptions, informed: true, output: dom.out4 },
  genOptions,
  once: true,
});

// start a new field and run search on it in a loop until a path is found, or once if once = true
async function findPath(field, search, options) {
  const { searchOptions, genOptions, once } = options;
  let pathFound = false;
  while (!pathFound) {
    await search(field, searchOptions).then((data) => {
      if (data || once) {
        pathFound = true;
        nodeHoverStats(field.field, searchOptions.output.display);
      } else {
        searchOptions.output.status.textContent = "Generating Field";
        field = generateField(genOptions);
      }
    });
  }
}

// Generate new field
//const field = generateField(generateOptions);

// Depth First Search params: field object (field, start, goal), DOM display function,
// and options (speed & informed search (true/false))
//depthFirstSearch(field, searchOptions);
//aStarSearch(field, searchOptions);
