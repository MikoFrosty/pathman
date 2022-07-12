// Check all directions for edge of array
export function boundaryCheck(dir, coords, field) {
  const [y, x] = coords;
  if (
    (y === 0 && dir === "up") ||
    (x === 0 && dir === "left") ||
    (y === field.length - 1 && dir === "down") ||
    (x === field[0].length - 1 && dir === "right")
  ) {
    return true;
  } else {
    return false;
  }
}

// Prepares a node for the openList
export function createNode(coords, parent, goal) {
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

// generate random number between min and max (inclusive)
export function randomNum(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Not sure what to do with this yet
/*
  const nodes = document.querySelectorAll("#field>div");
  nodes.forEach((node) => {
    // find position in nodelist
    const index = Array.prototype.indexOf.call(nodes, node);
    // find position in field
    const [nodeY, nodeX] = [
      Math.floor(index / field[0].length),
      index % field[0].length,
    ];
    // display array position when mouse hover node
    const nodeData = document.querySelector("#node-data");
    node.addEventListener("mouseover", (e) => {
      nodeData.style.display = "block";
      //make nodeData position next to mouse position
      nodeData.style.top = e.clientY - 60 + "px";
      nodeData.style.left = e.clientX - 60 + "px";
      // nodeData position by finger position on mobile
      nodeData.innerHTML = `${e.currentTarget.dataset.type}: y-${nodeY}, x-${nodeX}`;
    });
    node.addEventListener("mouseleave", (e) => {
      nodeData.style.display = "none";
      nodeData.innerHTML = "";
    });
  });
  */
