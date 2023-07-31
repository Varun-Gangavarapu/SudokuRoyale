export function handleNumPadClick(e, tileSelected, puzzle) {
  // Ripple effect
  let temp = e.currentTarget;
  addRipple(temp, e)

  if (tileSelected == null) {
    return puzzle;
  }
  if (!tileSelected.classList.contains("tile-start-and-selected")) {
    if (temp.id == "remover") {
      tileSelected.innerText = "";
      puzzle[tileSelected.id.split("-")[1] - 1][
        tileSelected.id.split("-")[2] - 1
      ] = ".";
    } else {
      let selectedNumber = temp.id.split("-")[1];
      tileSelected.innerText = selectedNumber;
      puzzle[tileSelected.id.split("-")[1] - 1][
        tileSelected.id.split("-")[2] - 1
      ] = selectedNumber;
    }
  }
  return puzzle;
}

function addRipple(temp, e) {
    let ripple = document.createElement('div');
    ripple.className = 'ripple';
  
    // Calculate the diameter and position of the ripple based on the dimensions of the button
    let width = temp.clientWidth;
    let height = temp.clientHeight;
    let diameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));  // Diagonal
    diameter *= 2;
    let radius = diameter / 2;
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
  
    // Calculate the position of the cursor relative to the clicked element
    let rect = temp.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
  
    // Adjust the position of the ripple
    ripple.style.top = `${y - radius}px`;
    ripple.style.left = `${x - radius}px`;
  
    // Append the ripple to the clicked element
    temp.appendChild(ripple);
  
    // Remove the ripple after the animation has finished
    setTimeout(() => {
      ripple.remove();
    }, 500);
}
