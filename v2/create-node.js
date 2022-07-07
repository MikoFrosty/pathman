export default function createNode(coords, parent, goal) {
  let gScore = parent?.coords ? parent.gScore + 1 : 0;
  let hScore = Math.abs(coords[0] - goal[0]) + Math.abs(coords[1] - goal[1]);

  return {
    coords,
    check: 0,
    parent,
    gScore,
    hScore,
    fScore: gScore + hScore,
  };
}
