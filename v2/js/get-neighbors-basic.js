import { boundaryCheck } from "./helpers.js";

export default function getNeighbors(fieldData, node, informed) {
  const { field, floor, goal } = fieldData;
  const [y, x] = node;
  const dirs = {
    up: [y - 1, x],
    right: [y, x + 1],
    down: [y + 1, x],
    left: [y, x - 1],
  };

  let neighbors = [];

  // check all squares around node for neighbors
  for (let dir in dirs) {
    if (!boundaryCheck(dir, [y, x], field)) {
      checkDirection(dirs[dir]);
    }
  }

  // sort current nodes by distance to goal
  // This informs the algorithm to move towards the goal
  if (informed) {
    neighbors.sort((a, b) => {
      let bDist = Math.abs(a[0] - goal[0]) + Math.abs(a[1] - goal[1]);
      let aDist = Math.abs(b[0] - goal[0]) + Math.abs(b[1] - goal[1]);
      return aDist - bDist;
    });
  }

  // Checks neighbors and pushes to neighbors list
  function checkDirection(coords) {
    const [y, x] = coords;
    if (field[y][x] === floor || (y === goal[0] && x === goal[1])) {
      neighbors.push(coords);
    }
  }

  return neighbors;
}
