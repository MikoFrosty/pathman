// FOR NODEJS
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(height = 12, width = 20) {
    this.world = Field.generateField(height, width);
    this.playerPosition = [0, 0];
    this.end = false;
    this.height = height;
    this.width = width;
  }

  print(world) {
    console.log(world.map((row) => row.join("")).join("\n"));
  }

  static generateField(height, width) {
    console.log("Generating Field");
    let game = [];
    function randomNum(min = 1, max = 9) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let num = randomNum();
        if (num < 7) {
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

  validateField() {
    //Validation
    console.log("Validating Field");

    const test = {
      path: [{ coords: this.playerPosition, nodes: [], check: 0 }],
      world: JSON.parse(JSON.stringify(this.world)), // world is an array of arrays // using json trick to deeply copy array
      //position: this.playerPosition, // [y, x] // not used for new algorithm
      directions: ["up", "right", "down", "left"],
      valid: false
    };

    //main loop 
    while (true) {
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
      } else {
        // if there are nodes
        // remove last node from current path
        test.path.push({
          coords: current.nodes.pop(),
          nodes: [],
          check: 0
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
      console.log("Out of bounds! Please select a different direction.");
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

let game = new Field(12, 20);
console.clear();

while (!game.validateField()) {
    game = new Field(12, 20);
}

(async () => {
  // pause for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.clear();
  while (!game.end) {
    game.print(game.world);
    let direction = await new Promise((resolve) => {
      rl.question("Which way? ", resolve);
    });
    console.clear();
    if (direction === "u") {
      game.up();
    } else if (direction === "d") {
      game.down();
    } else if (direction === "l") {
      game.left();
    } else if (direction === "r") {
      game.right();
    } else {
      console.log("INVALID ENTRY: Please use 'u', 'd', 'l', or 'r'");
    }
    if (game.end) {
      let answer = await new Promise((resolve) => {
        rl.question("Would you like to play again? y or n: ", resolve);
      });
      switch (answer) {
        case "y":
          game = new Field(Field.generateField(8, 12));
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
})();
