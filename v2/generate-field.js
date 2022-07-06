// generate field given height, width, and density // return object with field, start position, and goal position
export default function generateField(nodeHTML, density = 30, size = 10) {
    // Text outputs
    console.log("Generating Field"); // remove maybe
  
    // Init empty field & characters
    const field = [];
    const { floor, wall, start, goal } = nodeHTML;
    // fix for out of range density & size values
    density = density > 100 ? 100 : density < 0 ? 0 : density;
    size = size > 10 ? 10 : size < 0 ? 0 : size;

    // Predetermined field sizes
    const fieldSizes = [
      [10, 10],
      [12, 12],
      [14, 14],
      [16, 16],
      [18, 18],
      [20, 20],
      [22, 22],
      [24, 24],
      [26, 26],
      [28, 28],
      [30, 30]
    ];
    // destructure field size
    const [height, width] = fieldSizes[size];
  
    // Generate field using random numbers adjusting for density
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const num = randomNum();
        if (num > density) {
          row.push(floor);
        } else {
          row.push(wall);
        }
      }
      field.push(row);
    }
    // Add goal
    let goalPosX = randomNum(0, width - 1);
    let goalPosY = height - 1;
    field[goalPosY][goalPosX] = goal;
    // Add start
    let startPosX = randomNum(0, width - 1);
    let startPosY = 0;
    field[startPosY][startPosX] = start;
    // Return field
    return {
      field,
      start: [startPosY, startPosX],
      goal: [goalPosY, goalPosX],
    };
  }
  
  // Utility functions
  // generate random number between min and max (inclusive)
  function randomNum(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }