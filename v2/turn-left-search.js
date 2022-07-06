import boundryCheck from "./boundry-check.js";

export default async function turnLeftSearch(
  fieldObj,
  speed = 0,
  render,
  smartSort = false
) {
  const { field: trueField, start, goal } = fieldObj;

  console.log("Searching for path...");

  // Test world object
  const field = JSON.parse(JSON.stringify(trueField)); // json trick to deeply copy array
  const path = [{ coords: start, nodes: [], check: 0 }];
  let validPath;
  const directions = ["right", "down", "left", "up"];
  let valid = false;
  const pathData = `<div class="path" data-type="path" style="background-color: yellow"></div>`;
  const floor = `<div class="floor" data-type="floor"></div>`;
  const wall = `<div class="wall" data-type="wall"></div>`;
  const head = `<div class="head" data-type="head"></div>`;
  //let counter = 0; // for debugging

  //main loop
  while (true) {
    // assign last spot in path to 'current' (if path exists), and destructure
    let current = path[path.length - 1] ?? null;
    let [y, x] = current?.coords ?? [null, null];
    let tempPath = []; // for storing true path data while head is moving

    // swap current with temporary element to see where the head is
    if (current) {
      tempPath = field[y][x];
      field[y][x] = head;
    }

    // speed settings
    if (speed < 10) {
      await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
    }

    /*
    counter++; // for debugging
    if (counter === 10) {
      break;
    }
    */

    // display game
    render(field);
    field[y][x] = tempPath;

    // check winning and losing conditions
    if ([y, x].toString() === goal.toString()) {
      console.log("Path found!");
      validPath = path.map((path) => path.coords);
      valid = true;
      break;
    } else if (path.length < 1) {
      console.log("No path found!");
      valid = false;
      break;
    }

    // make sure current position updates and shows pathData
    if (
      [y, x].toString() !== start.toString() &&
      [y, x].toString() !== goal.toString()
    ) {
      field[y][x] = pathData;
    }

    // if current node hasn't been checked yet // each node should only be checked once
    if (!current.check) {
      console.log("Finding nodes");
      // check all squares around current square for list of nodes & push to current nodes node list
      directions.forEach((direction) => {
        // check if direction is valid
        if (!boundryCheck(direction, current.coords, field)) {
          switch (direction) {
            case "up":
              // if neighbor is not a wall
              if (
                field[y - 1][x] !== wall &&
                field[y - 1][x] !== pathData &&
                [y - 1, x].toString() !== start.toString()
              ) {
                // add node to last path
                current.nodes.push([y - 1, x]);
              }
              break;
            case "right":
              // if neighbor is not a wall
              if (
                field[y][x + 1] !== wall &&
                field[y][x + 1] !== pathData &&
                [y, x + 1].toString() !== start.toString()
              ) {
                // add node to last path
                current.nodes.push([y, x + 1]);
              }
              break;
            case "down":
              // if neighbor is not a wall
              if (
                field[y + 1][x] !== wall &&
                field[y + 1][x] !== pathData &&
                [y + 1, x].toString() !== start.toString()
              ) {
                // add node to last path
                current.nodes.push([y + 1, x]);
              }
              break;
            case "left":
              // if neighbor is not a wall
              if (
                field[y][x - 1] !== wall &&
                field[y][x - 1] !== pathData &&
                [y, x - 1].toString() !== start.toString()
              ) {
                // add node to last path
                current.nodes.push([y, x - 1]);
              }
              break;
          }
        }
      }); // End of forEach

      // sort current nodes by distance to goal
      // this is basically an a* depth first search
      if (smartSort) {
        current.nodes.sort((a, b) => {
          let bDist = Math.abs(a[0] - goal[0]) + Math.abs(a[1] - goal[1]);
          let aDist = Math.abs(b[0] - goal[0]) + Math.abs(b[1] - goal[1]);
          return aDist - bDist;
        });
      }
    } // End of if
    current.check = 1; // set current node to checked

    // check if current path has nodes :: Make into a while loop
    if (!current.nodes.length) {
      // if no nodes, pop off last path
      path.pop();
      console.log("Backtracking...");
    } else {
      // if there are nodes
      // remove last node from current path
      path.push({
        coords: current.nodes.pop(),
        nodes: [],
        check: 0,
      });
    }
  } // End of while loop

  render(field);
  return null;
}
