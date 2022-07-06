export default function boundryCheck(dir, coords, field) {
    switch (dir) {
      case "up":
        if (coords[0] === 0) {
          return true;
        }
        return false;
      case "right":
        if (coords[1] === field[0].length - 1) {
          return true;
        }
        return false;
      case "down":
        if (coords[0] === field.length - 1) {
          return true;
        }
        return false;
      case "left":
        if (coords[1] === 0) {
          return true;
        }
        return false;
    }
  }