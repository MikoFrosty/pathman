async validateField() {
    // Text outputs
    console.log("Validating Field");
    document.querySelector("#validation-result").innerHTML = "VALIDATING...";
    const pathTable = document.querySelector("#path-table-body");
    // Test world object
    const test = {
      path: [{ coords: this.playerPosition, nodes: [], check: 0 }],
      world: JSON.parse(JSON.stringify(this.world)), // world is an array of arrays // using json trick to deeply copy array
      directions: ["up", "right", "left", "down"],
      valid: false,
    };

    //main loop
    while (true) {
      // output path to pathTable
      pathTable.innerHTML = "";
      // Iterate through current path list and add to pathTable along with corresponding nodes
      for (let i = 0; i < test.path.length; i++) {
        let path = test.path[i];
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = path.coords;
        tr.appendChild(td);
        pathTable.appendChild(tr);
        let branch = document.createElement("td");
        path.nodes.forEach((node) => {
          branch.insertAdjacentHTML("beforeend", `&nbsp;${node}&nbsp;&nbsp;`);
        });
        tr.appendChild(branch);
      }
      // Halt if stop is true :: maybe add a pause and continue option ::
      if (stop) {
        break;
      }
      // speed settings
      if (speed < 10) {
        await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 20));
      }
      // display game
      console.clear();
      game.print(test.world);

      // check winning and losing conditions
      if (test.valid) {
        // add test path to validPath
        validPath = test.path.map(path => path.coords);
        console.clear();
        console.log("Valid Field Found");
        break;
      } else if (test.path.length < 1) {
        console.clear();
        console.log("Invalid Field");
        break; // break out of loop - valid remains false
      }
      // assign last spot in path to 'current'
      let current = test.path[test.path.length - 1];

      // if current node hasn't been checked yet // each node should only be checked once
      if (!current.check) {
        // check all squares around current square for list of nodes & push to current nodes node list
        test.directions.forEach((direction) => {
          // check if direction is valid
          if (!this._boundryCheck(direction, current.coords)) {
            switch (direction) {
              case "up":
                if (
                  test.world[current.coords[0] - 1][current.coords[1]] === hat
                ) {
                  test.valid = true;
                } else if (
                  // check if square is a field character
                  test.world[current.coords[0] - 1][current.coords[1]] ===
                  fieldCharacter
                ) {
                  // add node to last path
                  current.nodes.push([
                    current.coords[0] - 1,
                    current.coords[1],
                  ]);
                }
                break;
              case "right":
                if (
                  test.world[current.coords[0]][current.coords[1] + 1] === hat
                ) {
                  test.valid = true;
                } else if (
                  test.world[current.coords[0]][current.coords[1] + 1] ===
                  fieldCharacter
                ) {
                  current.nodes.push([
                    current.coords[0],
                    current.coords[1] + 1,
                  ]);
                }
                break;
              case "down":
                if (
                  test.world[current.coords[0] + 1][current.coords[1]] === hat
                ) {
                  test.valid = true;
                } else if (
                  test.world[current.coords[0] + 1][current.coords[1]] ===
                  fieldCharacter
                ) {
                  current.nodes.push([
                    current.coords[0] + 1,
                    current.coords[1],
                  ]);
                }
                break;
              case "left":
                if (
                  test.world[current.coords[0]][current.coords[1] - 1] === hat
                ) {
                  test.valid = true;
                } else if (
                  test.world[current.coords[0]][current.coords[1] - 1] ===
                  fieldCharacter
                ) {
                  current.nodes.push([
                    current.coords[0],
                    current.coords[1] - 1,
                  ]);
                }
                break;
            }
          }
        }); // End of forEach

        // sort current nodes by distance to hat
        // this is basically an a* depth first search
        current.nodes.sort((a, b) => {
          let bDist =
            Math.abs(a[0] - hatPosition[0]) +
            Math.abs(a[1] - hatPosition[1]);
          let aDist =
            Math.abs(b[0] - hatPosition[0]) +
            Math.abs(b[1] - hatPosition[1]);
          return aDist - bDist;
        });

        // make sure current position is a path character
        test.world[current.coords[0]][current.coords[1]] = pathCharacter;
        current.check = 1; // set current node to checked
      } // End of if

      // check if current path has nodes
      if (!current.nodes.length) {
        // if no nodes, pop off last path
        test.path.pop();
        console.log("Backtracking");
      } else {
        // if there are nodes
        // remove last node from current path
        test.path.push({
          coords: current.nodes.pop(),
          nodes: [],
          check: 0,
        });
      }
    } // End of while loop
    
    this.print(test.world);
    return test.valid;
  }