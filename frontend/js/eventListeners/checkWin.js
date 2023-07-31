import { solved } from "../generateGrid.js";
import { removeAllEventListeners } from "./removeAllEventListeners.js";

export function checkWin(puzzle) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] != solved[i][j]) {
        return false;
      }
    }
  }
  return true;
}
