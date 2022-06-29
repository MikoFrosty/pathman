async function runGame() {
  const hat = "^";
  const hole = "O";
  const fieldCharacter = "░";
  const pathCharacter = "*";
  let density = 5;
  let speed = 9;
  let fieldSize = {
    sizeArr: [[7, 10], [8, 12], [9, 14], [10, 16], [11, 18], [12,20]],
    current: 5
  }
  let stop = false;

  class Field {
    constructor(sizeArr) {
      this.world = Field.generateField(sizeArr[0], sizeArr[1]);
      this.playerPosition = [0, 0];
      this.end = false;
      this.height = sizeArr[0];
      this.width = sizeArr[1];
    }

    print(world) {
      console.log(world.map((row) => row.join("")).join("\n"));
    }

    static generateField(height, width) {
        document.querySelector("#validation-result").innerHTML = "";
      console.log("Generating Field");
      let game = [];
      function randomNum(min = 1, max = 10) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
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
      let hatPosX = randomNum(Math.ceil(width / 2), width - 1);
      let hatPosY = randomNum(Math.ceil(height / 2), height - 1);
      game[hatPosY][hatPosX] = hat;
      game[0][0] = pathCharacter;

      return game;
    }

    async validateField() {
      //Validation
      console.log("Validating Field");

      const test = {
        path: [{ coords: this.playerPosition, nodes: [], check: 0 }],
        world: JSON.parse(JSON.stringify(this.world)), // world is an array of arrays // using json trick to deeply copy array
        //position: this.playerPosition, // [y, x] // not used for new algorithm
        directions: ["up", "right", "down", "left"],
        valid: false,
      };

      //main loop
      while (true) {
        if (stop) {
          break;
        }
        // wait for a second
        if (speed < 10) {
          await new Promise((resolve) => setTimeout(resolve, (9 - speed) * 10));
        }
        console.clear();
        game.print(test.world);
        // loop forever - solution will be found and returned (true or false)

        // check winning and losing conditions
        if (test.valid) {
          console.clear();
          console.log("Valid Field Found");
          break;
        } else if (test.path.length < 1) {
          console.clear();
          console.log("Invalid Field");
          break; // break out of loop - valid remains false
        }
        // last spot in path
        let current = test.path[test.path.length - 1];

        // if current node hasn't been checked yet
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
        this.end = true;
        console.log("GAME OVER\nYou fell down a hole!");
      } else if (this.world[y][x] === hat) {
        this.end = true;
        console.log("YOU WIN\nYou found your hat!");
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
          document.querySelector("#size-slider-label").innerHTML = "Size (HxW): " + JSON.stringify(fieldSize.sizeArr[value]);
          game = new Field(fieldSize.sizeArr[fieldSize.current]);
          render();
          break;
        case "density-slider":
          document.querySelector("#density-slider-label").innerHTML = "Density: " + value;
          density = value;
          game = new Field(fieldSize.sizeArr[fieldSize.current]);
          render();
          break;
        case "speed-slider":
          document.querySelector("#speed-slider-label").innerHTML = value < 10 ? "Speed: " + value : "Speed: Instant";
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
              game = new Field(fieldSize.sizeArr[fieldSize.current]);
              render();
              break;
            case "validate":
              event.target.disabled = true;
              stop = false;
              let tempVal = await game.validateField();
              if (tempVal) {
                document.querySelector("#validation-result").innerHTML = "VALID FIELD FOUND";
                } else {
                    document.querySelector("#validation-result").innerHTML = "INVALID FIELD";
                }
              event.target.disabled = false;
              render();
              break;
            case "auto":
                event.target.disabled = true;
                stop = false;
                let tries = 1;
                while (!(await game.validateField())) {
                    if (stop) {
                      document.querySelector("#validation-result").innerHTML = "VALIDATION STOPPED | After " + tries + " tries";
                      event.target.disabled = false;
                      break;
                    }
                    tries++;
                    document.querySelector("#validation-result").innerHTML = "INVALID FIELD | No possible path";
                    game = new Field(fieldSize.sizeArr[fieldSize.current]);
                    render();
                }
                if (!stop) {
                  event.target.disabled = true;
                  document.querySelector("#validation-result").innerHTML = "VALID FIELD | Path found after " + tries + " tries";
                  break;
                }
            case "stop":
              stop = true;
              break;
            }
            // blur button to remove focus
            event.target.blur();
            render();
        })();
          });
      });
  }

  optionButtons();
  

  function endCheck() {
    if (game.end) {
      let answer = prompt("GAME OVER\nWould you like to play again? (y/n)");
      switch (answer) {
        case "y":
          game = new Field(fieldSize.sizeArr[fieldSize.current]);
          console.clear();
          break;
        case "n":
          console.clear();
          break;
        default:
          console.log("Invalid response: Game closing");
          break;
      }
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
