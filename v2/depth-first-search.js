import getNeighbors from "./get-neighbors-basic.js";
import nodeHTML from "./node-html.js";
import dom, { renderField as render } from "./dom.js";

export default async function depthFirstSearch(fieldData, options) {
  const { field: originalField, start, goal } = fieldData;
  const {
    speed = 0,
    informed = false,
    output: { display, status, search },
  } = options;
  const { floor, path, trail, neighbor, head, goal: goalHTML } = nodeHTML;
  let pathFound = false;

  search.textContent = `Depth First Search - ${informed ? "Informed" : "Uninformed"}`;
  status.textContent = "Searching for path...";

  // Test world object
  const field = originalField.map((array) => [...array]);
  const pathNodes = [{ coords: start, nodes: [], check: 0 }];

  //main loop
  while (pathNodes.length > 0) {
    status.textContent = "Searching for path...";
    // assign last spot in path to 'current' (if path exists), and destructure
    let current = pathNodes[pathNodes.length - 1] ?? null;
    let [y, x] = current?.coords ?? [null, null];

    // speed settings
    if (speed < 10) {
      await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
    }

    // Orange trail effect to show current best path found
    let currentTrail = pathNodes.map((node) => node.coords);
    currentTrail.forEach((coords) => {
      if (coords === start) {
      } else if (coords === currentTrail[currentTrail.length - 1]) {
        field[y][x] = head;
      } else {
        field[coords[0]][coords[1]] = trail;
      }
    });

    // display game
    render(field, originalField, display);

    // check winning and losing conditions
    if ([y, x].toString() === goal.toString()) {
      field[y][x] = goalHTML;
      pathFound = true;
      status.textContent = "Path found!";
      break;
    }

    // make sure current position updates and shows path
    if (
      [y, x].toString() !== start.toString() &&
      [y, x].toString() !== goal.toString()
    ) {
      field[y][x] = path;
    }

    // if current node hasn't been checked yet // each node should only be checked once
    if (!current.check) {
      status.textContent = "Finding neighbors...";
      current.nodes = getNeighbors(
        { field, floor, goal },
        current.coords,
        informed
      );
      current.check = 1;
    }

    // change current.nodes to neighbor in field
    current.nodes.forEach((node) => {
      field[node[0]][node[1]] = neighbor;
    });

    // check if current path has nodes :: Make into a while loop
    if (!current.nodes.length) {
      // if no nodes, pop off last path
      pathNodes.pop();
      status.textContent = "Backtracking...";
    } else {
      // if there are nodes
      // remove last node from current path
      pathNodes.push({
        coords: current.nodes.pop(),
        nodes: [],
        check: 0,
      });
    }
  } // End of while loop

  if (!pathFound) {
    status.textContent = "No path found!";
  }
  render(field, originalField, display);
  return pathFound;
}
