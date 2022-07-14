// PATHMAN - Pathfinding Algorithm Visualizer
// Language: javascript
// Created by: Brandon Mikowski

import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";
import dom, { nodeHoverStats, renderField as render } from "./dom.js";

// options for field generation & search
const searchOptions = {
  speed: 0,
  informed: true,
  output: dom.out1,
};
const genOptions = {
  density: 30,
  size: 1,
};

const reload = document.querySelector("#reload");
// reload page when runAgain is clicked
reload.addEventListener("click", () => {
  location.reload();
});

runDemo();

function runDemo() {
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
      }
    }, 200);
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
}

// Playground options
const searchOptionsPG = {
  speed: 0,
  informed: true,
  output: dom.out5,
};
const genOptionsPG = {
  density: 30,
  size: 9,
};
let searchPG = aStarSearch;

let fieldPG = generateField(genOptionsPG);
render(fieldPG.field, null, dom.out5.display);

// event listener for algo (select)
dom.algo.addEventListener("change", (e) => {
  const algo = e.target.value;
  if (algo === "astar") {
    dom.out5.search.textContent = "A*";
    searchPG = aStarSearch;
    searchOptionsPG.informed = true;
  } else if (algo === "dijkstra") {
    dom.out5.search.textContent = "Dijkstra";
    searchPG = aStarSearch;
    searchOptionsPG.informed = false;
  } else if (algo === "gbf") {
    dom.out5.search.textContent = "Greedy Best First";
    searchPG = depthFirstSearch;
    searchOptionsPG.informed = true;
  } else if (algo === "dfs") {
    dom.out5.search.textContent = "Depth First";
    searchPG = depthFirstSearch;
    searchOptionsPG.informed = false;
  }
});

// find path when clicked
dom.start.addEventListener("click", () => {
  findPath(fieldPG, searchPG, {
    searchOptions: { ...searchOptionsPG },
    genOptionsPG,
    once: true,
  });
});
// stop/clear when clicked
dom.stop.addEventListener("click", () => {
  render(fieldPG.field, null, dom.out5.display);
});
// generate and render new field when clicked
dom.new.addEventListener("click", () => {
  fieldPG = generateField(genOptionsPG);
  // render new field after short delay
  setTimeout(() => {
    render(fieldPG.field, null, dom.out5.display);
  }, 200);
});
// change density of field when slider is moved then follow actions for new.click()
dom.density.addEventListener("change", () => {
  dom.densityValue.textContent = dom.density.value;
  genOptionsPG.density = dom.density.value;
  dom.new.click();
});
// change speed of algorithms when slider is moved then follow actions for start.click()
dom.speed.addEventListener("change", () => {
  dom.speedValue.textContent = dom.speed.value;
  searchOptionsPG.speed = dom.speed.value;
  dom.start.click();
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
