import { boundaryCheck, createNode } from "./helpers.js";

export default function getNeighbors(fieldData, node, openList, informed) {
  const { field, floor, goal, neighbor } = fieldData;
  const [y, x] = node.coords;
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

  // push neighbors to openList
  openList.push(...neighbors);

  if (informed) {
    // sort openList primarily by fScore, secondarily by hScore
    openList.sort((a, b) => {
      if (a.fScore === b.fScore) {
        return b.hScore - a.hScore;
      } else {
        return b.fScore - a.fScore;
      }
    });
  } else {
    // Breadth first search instead of Best first A*
    openList.sort((a, b) => b.gScore - a.gScore);
    // no sort - basically depth first search
  }

  // add neighbor HTML to field for new neighbors found
  neighbors.forEach((branch) => {
    field[branch.coords[0]][branch.coords[1]] = neighbor;
  });

  // Handle neighbor check in specific direction
  function checkDirection(coords) {
    const [y, x] = coords;
    if (field[y][x] === floor || `${y}${x}` === `${goal[0]}${goal[1]}`) {
      let neighbor = createNode([y, x], node, goal);
      neighbors.push(neighbor);
    } else if (field[y][x] === neighbor) {
      compareNeighbors([y, x]);
    }
  }

  // Compare neighbors and update values if necessary
  function compareNeighbors(coords) {
    // find coords in openList
    let existingNeighbor = openList.find(
      (node) =>
        `${node.coords[0]}${node.coords[1]}` === `${coords[0]}${coords[1]}`
    );
    // compare gScore of existingNeighbor and node
    if (existingNeighbor.gScore > node.gScore + 1) {
      // if existingNeighbor gScore is greater than node gScore, replace existingNeighbor with node
      existingNeighbor.parent = node;
      existingNeighbor.gScore = node.gScore + 1;
      existingNeighbor.fScore = node.gScore + 1 + existingNeighbor.hScore;
    }
  }
}
