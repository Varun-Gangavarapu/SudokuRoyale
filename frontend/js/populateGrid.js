import { puzz, solved } from "./generateGrid.js";
import { handleTileClick } from "./eventListeners/handleTileClick.js";
import { handleKeyDown } from "./eventListeners/handleKeyDown.js";
import { handleNumPadClick } from "./eventListeners/handleNumPadClick.js";

export let puzzle = puzz;
let tileSelected;
export function fillGrid() {
  // Iterating the tile grid
  document.addEventListener("keydown", keyDownFunction);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let tile = document.getElementById(`tile-${i + 1}-${j + 1}`);
      tile.setAttribute("tabindex", "0"); // Idk what this is or why it is needed but keydown doesnt work without it and GPT told me this would fix
      
      // Assigning tiles
      if (puzzle[i][j] != ".") {
        tile.innerText = puzzle[i][j];
        tile.classList.add("tile-start");
      } else {
        tile.addEventListener("click", tileClickFunction)
      }
    }
  }

  for (let i = 1; i < 10; i++) {
    let number = document.getElementById(`num-${i}`);
    number.addEventListener('click', numPadClickFunction)
  }
  document.getElementById('remover').addEventListener('click', numPadClickFunction);
}

export function keyDownFunction(e) {
  if (e.key === "Tab") {
    e.preventDefault();
  } else {
    let puzzleCopy = puzzle.map((arr) => [...arr]); // Create a deep copy of the puzzle array
    const { tileSelected: newTileSelected, puzzle: newPuzzle } = handleKeyDown(
      e,
      tileSelected,
      puzzleCopy
    );
    tileSelected = newTileSelected;
    puzzle = newPuzzle.map((arr) => [...arr]); // Update the puzzle array with the returned copy
  }
}

export function tileClickFunction(e) {
  tileSelected = handleTileClick(e, tileSelected);
}

export function numPadClickFunction(e) {
  puzzle = handleNumPadClick(e, tileSelected, puzzle)
}
