import boundryCheck from "./boundry-check.js";

export default function getNeighbors(fieldData, node, informed) {
    const { field, floor, goal } = fieldData;
    const [ y, x ] = node;
    const directions = ["up", "right", "down", "left"];

    let neighbors = [];

    // check all squares around current square for list of nodes & push to current nodes node list
    directions.forEach((direction) => {
      // check if direction is valid
      if (!boundryCheck(direction, [y, x], field)) {
        switch (direction) {
          case "up":
            // if neighbor is not a wall
            if (
              field[y - 1][x] === floor ||
              [y - 1, x].toString() === goal.toString()
            ) {
              // add node to last path
              neighbors.push([y - 1, x]);
            }
            break;
          case "right":
            // if neighbor is not a wall
            if (
              field[y][x + 1] === floor ||
              [y, x + 1].toString() === goal.toString()
            ) {
              // add node to last path
              neighbors.push([y, x + 1]);
            }
            break;
          case "down":
            // if neighbor is not a wall
            if (
              field[y + 1][x] === floor ||
              [y + 1, x].toString() === goal.toString()
            ) {
              // add node to last path
              neighbors.push([y + 1, x]);
            }
            break;
          case "left":
            // if neighbor is not a wall
            if (
              field[y][x - 1] === floor ||
              [y, x - 1].toString() === goal.toString()
            ) {
              // add node to last path
              neighbors.push([y, x - 1]);
            }
            break;
        }
      }
    }); // End of forEach

    // sort current nodes by distance to goal
    // This informs the algorithm to move towards the goal
    if (informed) {
      neighbors.sort((a, b) => {
        let bDist = Math.abs(a[0] - goal[0]) + Math.abs(a[1] - goal[1]);
        let aDist = Math.abs(b[0] - goal[0]) + Math.abs(b[1] - goal[1]);
        return aDist - bDist;
      });
    }

    return neighbors;
}