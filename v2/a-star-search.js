import getNeighbors from "./get-neighbors-advanced.js";
import nodeHTML from "./node-html.js";
import { createNode, renderField as render } from "./helpers.js";

export default async function depthFirstSearch(fieldData, options) {
  const { field: originalField, start, goal } = fieldData;
  const { speed = 0, informed = false } = options;
  const { floor, path, trail, neighbor, head, goal: goalHTML } = nodeHTML;

  console.log("Searching for path...");

  // Test world object
  const field = JSON.parse(JSON.stringify(originalField)); // json trick to deeply copy array (In case original field is reused later)
  let openList = [];
  let closedList = [];
  const startNode = createNode(start, null, goal);
  openList.push(startNode);
  let pathFound = false;

  //main loop
  while (openList.length) {
    // assign last spot in path to 'current', and destructure
    let current = openList[openList.length - 1];
    let [y, x] = current.coords;

    closedList.push(openList.pop());

    // speed settings
    if (speed < 10) {
      await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
    }

    // start at goal and trace back to start
    let trailMarker = closedList[closedList.length - 1];
    let finalPath = [];
    while (trailMarker.parent) {
      finalPath.push(trailMarker.coords);
      trailMarker = trailMarker.parent;
    }
    finalPath.push(trailMarker.coords);
    finalPath.forEach((coords) => {
      if (coords !== start && coords.toString() !== goal.toString()) {
        field[coords[0]][coords[1]] = trail;
      }
    });

    if (current.coords === start) {
      // Do nothing
    } else if (current.coords === closedList[closedList.length - 1].coords) {
      field[y][x] = head;
    }

    // display game
    render(field);

    // Change to path
    finalPath.forEach((coords) => {
      if (coords !== start && coords.toString() !== goal.toString()) {
        field[coords[0]][coords[1]] = path;
      }
    });

    // check winning and losing conditions
    if ([y, x].toString() === goal.toString()) {
      field[y][x] = goalHTML;
      console.log("Path found!");
      pathFound = true;
      // start at goal and trace back to start
      let trailMarker = closedList[closedList.length - 1];
      let finalPath = [];
      while (trailMarker.parent) {
        finalPath.push(trailMarker.coords);
        trailMarker = trailMarker.parent;
      }
      finalPath.push(trailMarker.coords);
      finalPath.forEach((coords) => {
        if (coords !== start && coords.toString() !== goal.toString()) {
          field[coords[0]][coords[1]] = trail;
        }
      });
      break;
    }

    // make sure current position updates and shows path
    if (
      [y, x].toString() !== start.toString() &&
      [y, x].toString() !== goal.toString()
    ) {
      field[y][x] = path;
    }

    // find neighbors of current node // branches should be [{...}, {...}]
    // THIS IS BAD, BUT LETS SEE IF IT WORKS
    openList = getNeighbors(
      { field, floor, goal, neighbor },
      current,
      openList
    );
    current.check = 1;

    // change current.nodes to neighbor in field
    openList.forEach((branch) => {
      field[branch.coords[0]][branch.coords[1]] = neighbor;
    });
  } // End of while loop

  if (!openList.length) {
    console.log("No path found!");
  }
  render(field);

  return pathFound;
}
