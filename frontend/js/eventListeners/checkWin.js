import { solved } from "../generateGrid.js";
import { stopTimer } from "../timer.js";
import { removeAllEventListeners } from "./removeAllEventListeners.js";

export function checkWin(puzzle) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] != solved[i][j]) {
        return;
      }
    }
  }
  removeAllEventListeners();
  stopTimer()
  let winPopup = document.getElementById("winPopup");
  winPopup.style.display = "block";
  // Get the <span> element that closes the popup
  let closeBtn = document.getElementById("closePopupBtn");

  // When the user clicks on <span> (x), close the popup
  closeBtn.onclick = function () {
    winPopup.style.display = "none";
  };
}
