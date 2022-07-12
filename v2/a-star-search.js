import dealWithNeighbors from "./get-neighbors-advanced.js";
import nodeHTML from "./node-html.js";
import { createNode } from "./helpers.js";
import dom, { renderField as render } from "./dom.js";

export default async function aStarSearch(fieldData, options) {
  const { field: originalField, start, goal } = fieldData;
  const {
    speed = 0,
    informed = false,
    output: { display, status, search },
  } = options;
  const { floor, path, trail, neighbor, head, goal: goalHTML } = nodeHTML;
  
  search.textContent = `${informed ? "A*" : "Breadth First"}`;
  status.textContent = "Searching for path...";
  
  // Test world object
  const field = originalField.map((array) => [...array]);
  let openList = [];
  let closedList = [];
  const startNode = createNode(start, null, goal);
  openList.push(startNode);
  let pathFound = false;
  let steps = 0;

  //main loop
  while (openList.length) {
    steps++;
    // assign last spot in path to 'current', and destructure
    let current = openList[openList.length - 1];
    let [y, x] = current.coords;

    closedList.push(openList.pop());

    // speed settings
    if (speed < 10) {
      await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
    }

    // start at goal and trace back to start
    // trailmarker is last item in closedList
    let trailMarker = closedList[closedList.length - 1];
    let currentPath = [];

    // Show head of current path
    if (
      current.coords !== start &&
      current.coords === closedList[closedList.length - 1].coords
    ) {
      field[y][x] = head;
    }

    // push all parents of trailMarker to currentPath
    while (trailMarker.parent && trailMarker.parent !== startNode) {
      trailMarker = trailMarker.parent;
      currentPath.push(trailMarker.coords);
      field[trailMarker.coords[0]][trailMarker.coords[1]] = trail;
    }

    // display game
    render(field, originalField, display);

    // Change to path (explored square)
    currentPath.forEach((coords) => {
      field[coords[0]][coords[1]] = path;
    });

    // check winning and losing conditions
    if (y === goal[0] && x === goal[1]) {
      // Fix for goal turning into neighbor neighbor square
      field[y][x] = goalHTML;
      status.textContent = `Path found! Loops: ${steps} - Path length: ${currentPath.length}`;
      pathFound = true;
      // Show final trail
      currentPath.forEach((coords) => {
        field[coords[0]][coords[1]] = trail;
      });
      // Break out of while loop
      break;
    }

    // change head back to path
    if (current !== startNode) {
      field[y][x] = path;
    }

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
  render(field, originalField, display);

  return pathFound;
}
