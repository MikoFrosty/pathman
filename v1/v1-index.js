async function runGame() {
  const hat = "^";
  const hole = "O";
  const fieldCharacter = "░";
  const pathCharacter = "*";
  let density = 5;
  let speed = 0;
  let fieldSize = {
    sizeArr: [
      [7, 10],
      [8, 12],
      [9, 14],
      [10, 16],
      [11, 18],
      [12, 20],
    ],
    current: 5,
  };
  let stop = false;
  let playerPosition = [0, 0];
  let hatPosition = [0, 0];
  let validPath = [];

  class Field {
    constructor(sizeArr) {
      this.world = Field.generateField(sizeArr[0], sizeArr[1]);
      this.playerPosition = playerPosition;
      this.end = "false";
      this.height = sizeArr[0];
      this.width = sizeArr[1];
    }

    print(world) {
      console.log(world.map((row) => row.join("")).join("\n"));
    }

    // Create a field of the given size
    static generateField(height, width) {
      // Text outputs
      document.querySelector("#validation-result").innerHTML = "";
      console.log("Generating Field");
      // Empty field
      let game = [];
      // Random number generator
      function randomNum(min = 1, max = 10) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      // Generate field user random number generator
      for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
          let num = randomNum();
          if (num > density) {
            row.push(fieldCharacter);
          } else {
            row.push(hole);
          }
        }
        game.push(row);
      }
      // Add hat
      let hatPosX = randomNum(0, width - 1);
      let hatPosY = height - 1;
      game[hatPosY][hatPosX] = hat;
      hatPosition[0] = hatPosY;
      hatPosition[1] = hatPosX;
      // Add starting location
      let startPosX = randomNum(0, width - 1);
      let startPosY = 0;
      game[startPosY][startPosX] = pathCharacter;
      playerPosition[0] = startPosY;
      playerPosition[1] = startPosX;
      // Return field
      return game;
    }

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

    _updatePosition() {
      let [y, x] = this.playerPosition;
      if (this.world[y][x] === hole) {
        this.end = "hole";
        console.log("GAME OVER\nYou fell down a hole!");
      } else if (this.world[y][x] === hat) {
        this.end = "hat";
      } else {
        this.world[y][x] = pathCharacter;
      }
    }
    _boundryCheck(dir, coords) {
      function oob() {
        console.log("Boundry detected");
      }
      switch (dir) {
        case "up":
          if (coords[0] === 0) {
            oob();
            return true;
          }
          return false;
        case "right":
          if (coords[1] === this.width - 1) {
            oob();
            return true;
          }
          return false;
        case "down":
          if (coords[0] === this.height - 1) {
            oob();
            return true;
          }
          return false;
        case "left":
          if (coords[1] === 0) {
            oob();
            return true;
          }
          return false;
      }
    }
    up() {
      if (!this._boundryCheck("up", this.playerPosition)) {
        this.playerPosition[0]--;
        this._updatePosition();
      }
    }
    down() {
      if (!this._boundryCheck("down", this.playerPosition)) {
        this.playerPosition[0]++;
        this._updatePosition();
      }
    }
    left() {
      if (!this._boundryCheck("left", this.playerPosition)) {
        this.playerPosition[1]--;
        this._updatePosition();
      }
    }
    right() {
      if (!this._boundryCheck("right", this.playerPosition)) {
        this.playerPosition[1]++;
        this._updatePosition();
      }
    }
  }

  let game = new Field(fieldSize.sizeArr[fieldSize.current]);

  // click event listener for buttons
  const directions = document.querySelectorAll("#buttons>button");
  const options = document.querySelectorAll("#options>button");
  const sliders = document.querySelectorAll("#sliders input");

  // event listeners for sliders
  sliders.forEach((slider) => {
    slider.addEventListener("change", (e) => {
      let value = e.target.value;
      let id = e.target.id;
      switch (id) {
        case "size-slider":
          fieldSize.current = value;
          document.querySelector("#size-slider-label").innerHTML =
            "Size (HxW): " + JSON.stringify(fieldSize.sizeArr[value]);
          game = new Field(fieldSize.sizeArr[fieldSize.current]);
          render();
          break;
        case "density-slider":
          document.querySelector("#density-slider-label").innerHTML =
            "Density: " + value;
          density = value;
          game = new Field(fieldSize.sizeArr[fieldSize.current]);
          render();
          break;
        case "speed-slider":
          document.querySelector("#speed-slider-label").innerHTML =
            value < 10 ? "Speed: " + value : "Speed: Instant";
          speed = value;
          break;
      }
    });
  });

  // add event listener to wasd keys for up, down, left, right
  document.addEventListener(
    "keydown",
    (e) => {
      switch (e.key) {
        case "w":
          game.up();
          break;
        case "a":
          game.left();
          break;
        case "s":
          game.down();
          break;
        case "d":
          game.right();
          break;
      }
      endCheck();
      render();
    },
    false
  );

  directions.forEach((direction) => {
    direction.addEventListener("click", (event) => {
      switch (event.target.id) {
        case "up":
          game.up();
          break;
        case "down":
          game.down();
          break;
        case "left":
          game.left();
          break;
        case "right":
          game.right();
          break;
      }
      endCheck();
      render();
    });
  });

  async function optionButtons() {
    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        (async () => {
          switch (event.target.id) {
            case "new":
              stop = true;
              game = new Field(fieldSize.sizeArr[fieldSize.current]);
              // render is called after 200ms to allow time for the game to stop rendering test fields if busy validating
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve(render());
                }, 200);
              });
              break;
            // SINGLE VALIDATION
            case "validate":
              event.target.disabled = true;
              stop = false;
              let tempVal = await game.validateField();
              if (tempVal) {
                document.querySelector("#validation-result").innerHTML =
                  "VALID FIELD FOUND";
              } else {
                document.querySelector("#validation-result").innerHTML =
                  "INVALID FIELD";
              }
              event.target.disabled = false;

              
              //render(); // TEMP TEST // Allows user to see the field after validation
              break;
            // AUTO VALIDATION
            case "auto":
              event.target.disabled = true;
              stop = false;
              let tries = 1;
              document.querySelector("#validation-result").innerHTML =
                "VALIDATING...";
              while (!(await game.validateField())) {
                if (stop) {
                  document.querySelector("#validation-result").innerHTML =
                    "VALIDATION STOPPED | After " + tries + " tries";
                  break;
                }
                if (tries >= 5000) {
                  stop = true;
                  document.querySelector("#validation-result").innerHTML =
                    "VALIDATION STOPPED | Limit reached at 5000 tries";
                  break;
                } else {
                  tries++;
                }
                document.querySelector("#validation-result").innerHTML =
                  "INVALID FIELD | No possible path";
                game = new Field(fieldSize.sizeArr[fieldSize.current]);
                render();
              }

              event.target.disabled = false;
              if (!stop) {
                document.querySelector("#validation-result").innerHTML =
                  "VALID FIELD | Path found after " + tries + " tries";
                break;
              }
            case "stop":
              stop = true;
              break;
          }
          // blur button to remove focus
          event.target.blur();
          //render(); // TEMP TEST // Allows user to see the field after validation
          // Make final path red colored and show it on the field
          validPath.forEach((coord) => {
            game.field[coord[0]][coord[1]] = "<span class='red'>X</span>";
          })
          render();

        })();
      });
    });
  }

  optionButtons();

  function endCheck() {
    if (game.end === "hat") {
      alert("You found your hat! | New game starting");
      game = new Field(fieldSize.sizeArr[fieldSize.current]);
      render();
    } else if (game.end === "hole") {
      alert("You fell down a hole! | New game starting");
      game = new Field(fieldSize.sizeArr[fieldSize.current]);
      render();
    }
  }

  function render() {
    console.clear();
    game.print(game.world);
  }

  // pause for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  render();
}

runGame();
