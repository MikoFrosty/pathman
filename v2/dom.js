const dom = {
  out1: {
    status: document.querySelector("#status1"),
    display: document.querySelector("#display1"),
    search: document.querySelector("#search1"),
  },
  out2: {
    status: document.querySelector("#status2"),
    display: document.querySelector("#display2"),
    search: document.querySelector("#search2"),
  },
  out3: {
    status: document.querySelector("#status3"),
    display: document.querySelector("#display3"),
    search: document.querySelector("#search3"),
  },
  out4: {
    status: document.querySelector("#status4"),
    display: document.querySelector("#display4"),
    search: document.querySelector("#search4"),
  },
  out5: {
    status: document.querySelector("#status5"),
    display: document.querySelector("#display5"),
    search: document.querySelector("#search5"),
  },
  reload: document.querySelector("#reload"),
  algo: document.querySelector("#algorithm-select"),
  start: document.querySelector("#start"),
  stop: document.querySelector("#stop"),
  new: document.querySelector("#new"),
  density: document.querySelector("#density"),
  densityValue: document.querySelector("#density-value"),
  speed: document.querySelector("#speed"),
  speedValue: document.querySelector("#speed-value"),
};

export default dom;

export function nodeHoverStats(field, display) {
  const nodes = display.querySelectorAll("div");
  nodes.forEach((node) => {
    // find position in nodelist
    const index = Array.prototype.indexOf.call(nodes, node);
    // find position in field
    const [nodeY, nodeX] = [
      Math.floor(index / field[0].length),
      index % field[0].length,
    ];

    // display array position when mouse hover node
    const nodeData = document.querySelector(".node-data");

    node.addEventListener("mouseover", showNodeData);
    node.addEventListener("mouseleave", hideNodeData);

    function showNodeData(e) {
      nodeData.style.display = "block";
      //make nodeData position next to mouse position
      nodeData.style.top = e.pageY - 60 + "px";
      nodeData.style.left = e.pageX - 60 + "px";
      // nodeData position by finger position on mobile
      nodeData.innerHTML = `${e.currentTarget.dataset.type}: y-${nodeY}, x-${nodeX}`;
    }

    function hideNodeData() {
      nodeData.style.display = "none";
      nodeData.innerHTML = "";
    }
  });
}

// print field to DOM
export function renderField(field, oldField, display) {
  // oldField will be used for possible smart updating in the future
  // Possibly use this area for removing event listeners (if exist) and adding event listensers for the node squares
  const fieldHTML = field.map((row) => row.join("")).join("<br />");
  display.innerHTML = fieldHTML;
}
