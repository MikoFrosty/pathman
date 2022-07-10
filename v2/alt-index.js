import depthFirstSearch from "./depth-first-search.js";
import generateField from "./generate-field.js";
import aStarSearch from "./a-star-search.js";

const searchOptions = {
  speed: 5,
  informed: true,
};

const generateOptions = {
  density: 10,
  size: 10,
};

// start a new field and run aStarSearch on it in a loop until a path is found
(async () => {
  let pathFound = false;
  while (!pathFound) {
    let field = generateField(generateOptions);
    await aStarSearch(field, searchOptions).then((data) => {
      if (data) {
        pathFound = true;
        nodeHoverStats(field.field);
      }
    });
  }
})();

// Generate new field
//const field = generateField(generateOptions);

// Depth First Search params: field object (field, start, goal), DOM display function,
// and options (speed & informed search (true/false))
//depthFirstSearch(generateField(nodeHTML, 30, 10), nodeHTML, searchOptions);
//aStarSearch(field, searchOptions);

function nodeHoverStats(field) {
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
    
    node.addEventListener("mouseover", showNodeData);
    node.addEventListener("mouseleave", hideNodeData);
    
    function showNodeData(e) {
      nodeData.style.display = "block";
      //make nodeData position next to mouse position
      nodeData.style.top = e.clientY - 60 + "px";
      nodeData.style.left = e.clientX - 60 + "px";
      // nodeData position by finger position on mobile
      nodeData.innerHTML = `${e.currentTarget.dataset.type}: y-${nodeY}, x-${nodeX}`;
    }

    function hideNodeData() {
      nodeData.style.display = "none";
      nodeData.innerHTML = "";
    }
  });
}
