import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";
import dom, { nodeHoverStats } from "./dom.js";

const searchOptions = {
  speed: 0,
  informed: true,
  output: dom.out1,
};
const genOptions = {
  density: 30,
  size: 1,
};

// hide display 1 while seaching for valid field
for (let element in dom.out1) {
  dom.out1[element].style.display = "none";
}
findPath(generateField(genOptions), aStarSearch, {
  searchOptions: {
    ...searchOptions,
    speed: 10,
    informed: true,
    output: dom.out1,
  },
  genOptions,
  once: false,
}).then((field) => {
  // show display 1 (after short delay to let algorithms spin up)
  setTimeout(() => {
  for (let element in dom.out1) {
    dom.out1[element].style.display = "block";
  }}, 200);
  // Dijkstra
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
});

// start a new field and run search on it in a loop until a path is found, or once if once = true
async function findPath(field, search, options) {
  const { searchOptions, genOptions, once } = options;
  let pathFound = false;
  let loops = 0;
  while (!pathFound) {
    loops++;
    if (loops > 100) {
      console.log("100 loops exceeded, stopping search");
      break;
    }
    await search(field, searchOptions).then((data) => {
      if (data) {
        nodeHoverStats(field.field, searchOptions.output.display);
        pathFound = true;
      } else if (!data && !once) {
        searchOptions.output.status.textContent = "Generating Field";
        field = generateField(genOptions);
      }
    });
    if (once) {
      break;
    }
  }
  return field;
}
