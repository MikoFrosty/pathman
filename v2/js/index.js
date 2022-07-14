// PATHMAN - Pathfinding Algorithm Visualizer
// Language: javascript
// Created by: Brandon Mikowski

///////////////////////// IMPORTS //////////////////////////
import generateField from "./generate-field.js";
import aStar from "./queue-search.js";
import dfs from "./stack-search.js";
import dom, { nodeHoverStats, renderField as render } from "./dom.js";

/////////////////////////// DEMO ///////////////////////////
const searchOptions = {
  speed: 0,
  informed: true,
  output: dom.out1,
};
const genOptions = {
  density: 30,
  size: 1,
};

runDemo();

//////////////////////// PLAYGROUND //////////////////////////
const searchOptionsPG = {
  speed: 0,
  informed: true,
  output: dom.out5,
  algo: aStar,
};
const genOptionsPG = {
  density: 30,
  size: 9,
};
// initialize new field and display
let fieldPG = generateField(genOptionsPG);
render(fieldPG.field, null, dom.out5.display);

//////////////////// EVENT LISTENERS //////////////////////////
// reload button
dom.reload.addEventListener("click", () => {
  location.reload();
});
// dropdown menu
dom.algo.addEventListener("change", (e) => {
  const algo = e.target.value;
  if (algo === "astar") {
    dom.out5.search.textContent = "A*";
    searchOptionsPG.algo = aStar;
    searchOptionsPG.informed = true;
  } else if (algo === "dijkstra") {
    dom.out5.search.textContent = "Dijkstra";
    searchOptionsPG.algo = aStar;
    searchOptionsPG.informed = false;
  } else if (algo === "gbf") {
    dom.out5.search.textContent = "Greedy Best First";
    searchOptionsPG.algo = dfs;
    searchOptionsPG.informed = true;
  } else if (algo === "dfs") {
    dom.out5.search.textContent = "Depth First";
    searchOptionsPG.algo = dfs;
    searchOptionsPG.informed = false;
  }
});
// start button
dom.start.addEventListener("click", () => {
  findPath(fieldPG, searchOptionsPG.algo, {
    searchOptions: { ...searchOptionsPG },
    genOptionsPG,
    once: true,
  });
});
// stop button
dom.stop.addEventListener("click", () => {
  render(fieldPG.field, null, dom.out5.display);
});
// new button (generate new field)
dom.new.addEventListener("click", () => {
  fieldPG = generateField(genOptionsPG);
  // render new field after short delay
  setTimeout(() => {
    render(fieldPG.field, null, dom.out5.display);
  }, 200);
});
// density slider
dom.density.addEventListener("change", () => {
  dom.densityValue.textContent = dom.density.value;
  genOptionsPG.density = dom.density.value;
  dom.new.click();
});
// speed slider
dom.speed.addEventListener("change", () => {
  dom.speedValue.textContent = dom.speed.value;
  searchOptionsPG.speed = dom.speed.value;
  dom.start.click();
});

//////////////////////// FUNCTIONS ////////////////////////////
function runDemo() {
  // hide display 1 while seaching for valid field
  for (let element in dom.out1) {
    dom.out1[element].style.display = "none";
  }
  findPath(generateField(genOptions), aStar, {
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
    findPath(field, aStar, {
      searchOptions: { ...searchOptions, informed: false, output: dom.out1 },
      genOptions,
      once: true,
    });
    // Depth First
    findPath(field, dfs, {
      searchOptions: { ...searchOptions, informed: false, output: dom.out2 },
      genOptions,
      once: true,
    });
    // A*
    findPath(field, aStar, {
      searchOptions: { ...searchOptions, informed: true, output: dom.out3 },
      genOptions,
      once: true,
    });
    // Best Depth First
    findPath(field, dfs, {
      searchOptions: { ...searchOptions, informed: true, output: dom.out4 },
      genOptions,
      once: true,
    });
  });
}

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
