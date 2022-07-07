import boundryCheck from "./boundry-check.js";
import createNode from "./create-node.js";

export default function getNeighbors(fieldData, node, openList) {
    const { field, floor, goal, neighbor } = fieldData;
    const [ y, x ] = node.coords;
    const directions = ["up", "right", "down", "left"];

    let neighbors = [];

    // check all squares around current square for list of nodes & push to current nodes node list
    directions.forEach((direction) => {
      // check if direction is valid
      if (!boundryCheck(direction, [y, x], field)) {
        switch (direction) {
          case "up":
            // if neighbor is floor or goal
            if (
              field[y - 1][x] === floor ||
              [y - 1, x].toString() === goal.toString()
            ) {
              // Create neighbor object
              let neighbor = createNode([y - 1, x], node, goal);
              // add neighbor to neighbors
              neighbors.push(neighbor);
            } else if (field[y - 1][x] === neighbor) {
                // find [y-1, x] in openList
                let existingNeighbor = openList.find(
                    (node) => node.coords.toString() === [y - 1, x].toString()
                );
                // compare gScore of existingNeighbor and node
                if (existingNeighbor.gScore > node.gScore + 1) {
                    // if existingNeighbor gScore is greater than node gScore, replace existingNeighbor with node
                    existingNeighbor.parent = node;
                    existingNeighbor.gScore = node.gScore + 1;
                    existingNeighbor.fScore = node.gScore + 1 + existingNeighbor.hScore;
                }
            }
            break;
          case "right":
            if (
                field[y][x + 1] === floor ||
                [y, x + 1].toString() === goal.toString()
            ) {
                let neighbor = createNode([y, x + 1], node, goal);
                neighbors.push(neighbor);
            } else if (field[y][x + 1] === neighbor) {
                let existingNeighbor = openList.find(
                    (node) => node.coords.toString() === [y, x + 1].toString()
                );
                if (existingNeighbor.gScore > node.gScore + 1) {
                    existingNeighbor.parent = node;
                    existingNeighbor.gScore = node.gScore + 1;
                    existingNeighbor.fScore = node.gScore + 1 + existingNeighbor.hScore;
                }
            }
            break;
            case "down":
                if (
                    field[y + 1][x] === floor ||
                    [y + 1, x].toString() === goal.toString()
                ) {
                    let neighbor = createNode([y + 1, x], node, goal);
                    neighbors.push(neighbor);
                } else if (field[y + 1][x] === neighbor) {
                    let existingNeighbor = openList.find(
                        (node) => node.coords.toString() === [y + 1, x].toString()
                    );
                    if (existingNeighbor.gScore > node.gScore + 1) {
                        existingNeighbor.parent = node;
                        existingNeighbor.gScore = node.gScore + 1;
                        existingNeighbor.fScore = node.gScore + 1 + existingNeighbor.hScore;
                    }
                }
                break;
            case "left":
                if (
                    field[y][x - 1] === floor ||
                    [y, x - 1].toString() === goal.toString()
                ) {
                    let neighbor = createNode([y, x - 1], node, goal);
                    neighbors.push(neighbor);
                } else if (field[y][x - 1] === neighbor) {
                    let existingNeighbor = openList.find(
                        (node) => node.coords.toString() === [y, x - 1].toString()
                    );
                    if (existingNeighbor.gScore > node.gScore + 1) {
                        existingNeighbor.parent = node;
                        existingNeighbor.gScore = node.gScore + 1;
                        existingNeighbor.fScore = node.gScore + 1 + existingNeighbor.hScore;
                    }
                }
                break;
        }
        }
    });
    // push neighbors to openList
    openList.push(...neighbors);
    // sort openList by fScore
    openList.sort((a, b) => b.fScore - a.fScore);
    
    return openList;
}