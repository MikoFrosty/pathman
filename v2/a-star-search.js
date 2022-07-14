import dealWithNeighbors from "./get-neighbors-advanced.js";
import nodeHTML from "./node-html.js";
import { createNode } from "./helpers.js";
import dom, { renderField as render, stopOnce } from "./dom.js";

// MAIN FUNCTION
export default async function aStarSearch(fieldData, options) {
  // Destructuring parameters & nodeHTML
  const { field: originalField, start, goal } = fieldData;
  let {
    speed,
    informed = false,
    output: { display, status, search },
  } = options;
  const { floor, path, trail, neighbor, head, goal: goalHTML } = nodeHTML;

  // Display text
  search.textContent = `${informed ? "A*" : "Dijkstra"}`;
  status.textContent = "Searching for path...";

  // Creating variables & objects. Push start node to openList
  const field = originalField.map((array) => [...array]);
  let openList = [];
  let closedList = [];
  const startNode = createNode(start, null, goal);
  openList.push(startNode);
  let pathFound = false;
  let steps = 0;
  let stop = [false];
  // Stop on button press
  stopOnce([dom.start, dom.stop, dom.new], stop);

  // MAIN LOOP
  while (openList.length) {
    // Break if stop is clicked
    if (stop[0]) {
      break;
    }
    steps++;
    // assign last spot in path to 'current', and destructure
    let current = openList[openList.length - 1];
    let [y, x] = current.coords;

    closedList.push(openList.pop());

    // speed settings
    if (speed < 10) {
      await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
    }

    // Setting up current trail
    let trailMarker = closedList[closedList.length - 1];
    let currentPath = [];
    // Show head of current trail
    if (
      current.coords !== start &&
      current.coords === closedList[closedList.length - 1].coords
    ) {
      field[y][x] = head;
    }
    // Push all parents of trailMarker to currentPath. Convert to trail squares (orange)
    while (trailMarker.parent && trailMarker.parent !== startNode) {
      trailMarker = trailMarker.parent;
      currentPath.push(trailMarker.coords);
      field[trailMarker.coords[0]][trailMarker.coords[1]] = trail;
    }

    // Display game
    render(field, originalField, display);

    // check winning and losing conditions
    if (y === goal[0] && x === goal[1]) {
      // Fix for goal turning into neighbor neighbor square
      field[y][x] = goalHTML;
      status.textContent = `Path found! Loops: ${steps} - Path length: ${currentPath.length}`;
      pathFound = true;
      // Break out of while loop
      break;
    }

    // Change back to path (explored green square)
    currentPath.forEach((coords) => {
      field[coords[0]][coords[1]] = path;
    });
    // Change head back to path
    if (current !== startNode) {
      field[y][x] = path;
    }

    // Display status message
    status.textContent = "Finding neighbors...";
    // Find all neighbors of current node, and push to openList. Sort openList. Add neighbors to field.
    dealWithNeighbors(
      { field, floor, goal, neighbor },
      current,
      openList,
      informed
    );
  } // End of while loop

  if (!pathFound) {
    status.textContent = "No path found!";
  }
  // Final render
  render(field, originalField, display);

  // (true/false)
  return pathFound;
}
