
export function handleTileClick(e, tileSelected) {
    // Removing the selected class from the previously selected tile and applying to the current tile
    if (tileSelected != null) {
      tileSelected.classList.remove("tile-selected");
      tileSelected.classList.remove("tile-start-and-selected");

    }
    const newTileSelected = e.currentTarget; 
    newTileSelected.classList.add("tile-selected");
    return newTileSelected;
  }
  