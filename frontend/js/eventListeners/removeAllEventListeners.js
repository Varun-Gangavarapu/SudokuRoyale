import { handleKeyDown } from "./handleKeyDown.js";
import { handleTileClick } from "./handleTileClick.js";
import { keyDownFunction, tileClickFunction } from "../populateGrid.js";

export function removeAllEventListeners() {
  document.removeEventListener("keydown", keyDownFunction);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let tile = document.getElementById(`tile-${i + 1}-${j + 1}`);
      
      tile.removeEventListener("click", tileClickFunction);
      
    }
  }
}
