import { addCandidates } from "../addCandidates.js";
import { checkWin } from "./checkWin.js";
import { removeAllEventListeners } from "./removeAllEventListeners.js";

export function handleKeyDown(e, tileSelected, puzzle) {
  if (tileSelected != null) {
    // If there is a selected tile
    var coords = tileSelected.id.split("-");
    if (
      !isNaN(Number(e.key)) &&
      !
        tileSelected.classList.contains("tile-start-and-selected")
      
    ) {
      // If the entered key is a number
      //if the tile is given, you cannot modify the number inside

      if (Number(e.key) != 0) {
        // If the number is not a 0
        tileSelected.innerText = e.key; // Make the inner text of the selected tile the key pressed
        puzzle[tileSelected.id.split("-")[1] - 1][
          tileSelected.id.split("-")[2] - 1
        ] = "" + e.key; // Update the puzzle array to reflect this change
        //check if the change resulted in a win
        checkWin(puzzle);
      }
    } else if (
      (e.key == "Backspace" || e.key == "Delete") &&
      !
        tileSelected.classList.contains("tile-start-and-selected")
      
    ) {
      //if the tile is selected, you cannot delete the text inside

      tileSelected.innerText = ""; // Remove the inner text
      puzzle[tileSelected.id.split("-")[1] - 1][
        tileSelected.id.split("-")[2] - 1
      ] = "."; // Update the puzzle
      addCandidates(tileSelected)
    } else if (
      e.key == "ArrowLeft" ||
      e.key == "ArrowRight" ||
      e.key == "ArrowUp" ||
      e.key == "ArrowDown"
    ) {
      var newIDCoord = null;
      if (e.key == "ArrowLeft" && coords[2] != 1) {
        //checks coordinate bounds so that you can't arrow out of the board

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        tileSelected.classList.remove("tile-selected");

        tileSelected.classList.remove("tile-start-and-selected");

        //calculates new coordinates
        newIDCoord = "tile-" + coords[1] + "-" + (parseInt(coords[2]) - 1);
      } else if (e.key == "ArrowRight" && coords[2] != 9) {
        //checks coordinate bounds so that you can't arrow out of the board
        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        tileSelected.classList.remove("tile-selected");

        tileSelected.classList.remove("tile-start-and-selected");

        //calculates new coordinates
        newIDCoord = "tile-" + coords[1] + "-" + (parseInt(coords[2]) + 1);
      } else if (e.key == "ArrowUp" && coords[1] != 1) {
        //checks coordinate bounds so that you can't arrow out of the board

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        tileSelected.classList.remove("tile-selected");

        tileSelected.classList.remove("tile-start-and-selected");

        //calculates new coordinates
        newIDCoord = "tile-" + (parseInt(coords[1]) - 1) + "-" + coords[2];
      } else if (e.key == "ArrowDown" && coords[1] != 9) {
        //checks coordinate bounds so that you can't arrow out of the board

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        tileSelected.classList.remove("tile-selected");

        tileSelected.classList.remove("tile-start-and-selected");

        //calculates new coordinates
        newIDCoord = "tile-" + (parseInt(coords[1]) + 1) + "-" + coords[2];
      }
      if (newIDCoord != null) {
        //gets new tile element
        var newTile = document.getElementById(newIDCoord);
        //adds the 'selected' property to the tile (if it's a start tile, add tile-start-and-selected property)
        if (newTile.classList.contains("tile-start")) {
          newTile.classList.add("tile-start-and-selected");
        } else {
          newTile.classList.add("tile-selected");
        }
        //sets tileSelected to the new tile
        tileSelected = document.getElementById(newIDCoord);
      }
    }
    return {
      tileSelected,
      puzzle,
    };
  }
  return {
    tileSelected,
    puzzle,
  };
}
