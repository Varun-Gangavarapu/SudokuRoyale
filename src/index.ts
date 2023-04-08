import './index.css';

function generateGrid(): String[][] {
  let numbers1To9: number[] = new Array(9);
  let grid: number[] = new Array(81);

  // Populating number collection
  for (let i = 1; i <= 9; i++) numbers1To9[i - 1] = i;

  //loads all boxes(3x3) in grid with numbers 1 through 9
  for (let i = 0; i < 81; i++) {
    // Shuffle the number collection once a box is filled
    if (i % 9 === 0) {
      numbers1To9.sort(() => Math.random() - 0.5);
    }
    let perBox =
      (~~(i / 3) % 3) * 9 + ~~(~~(i % 27) / 9) * 3 + ~~(i / 27) * 27 + (i % 3); // Box formula
    grid[perBox] = numbers1To9[i % 9];
  }

  // tracks rows and columns that have been sorted
  let sorted: boolean[] = new Array(81);

  for (let i = 0; i < 9; i++) {
    let backtrack = false;

    //0 is row, 1 is column
    for (let a = 0; a < 2; a++) {
      //every number 1-9 that is encountered is registered
      let registered: boolean[] = new Array(10); //index 0 will letentionally be left empty since there are only number 1-9.
      let rowOrigin = i * 9;
      let colOrigin = i;

      ROW_COL: for (let j = 0; j < 9; j++) {
        //row/column stepping - making sure numbers are only registered once and marking which cells have been sorted
        let step = a % 2 === 0 ? rowOrigin + j : colOrigin + j * 9;
        let num = grid[step];

        if (!registered[num]) registered[num] = true;
        else {
          //if duplicate in row/column

          //box and adjacent-cell swap (BAS method)
          //checks for either unregistered and unsorted candidates in same box,
          //or unregistered and sorted candidates in the adjacent cells
          for (let y = j; y >= 0; y--) {
            let scan = a % 2 === 0 ? i * 9 + y : i + 9 * y;
            if (grid[scan] === num) {
              //box stepping
              for (let z = a % 2 === 0 ? ((i % 3) + 1) * 3 : 0; z < 9; z++) {
                if (a % 2 === 1 && z % 3 <= i % 3) continue;
                let boxOrigin = ~~((scan % 9) / 3) * 3 + ~~(scan / 27) * 27;
                let boxStep = boxOrigin + ~~(z / 3) * 9 + (z % 3);
                let boxNum = grid[boxStep];
                if (
                  (!sorted[scan] && !sorted[boxStep] && !registered[boxNum]) ||
                  (sorted[scan] &&
                    !registered[boxNum] &&
                    (a % 2 === 0
                      ? boxStep % 9 === scan % 9
                      : ~~(boxStep / 9) === ~~(scan / 9)))
                ) {
                  grid[scan] = boxNum;
                  grid[boxStep] = num;
                  registered[boxNum] = true;
                  continue ROW_COL;
                } else if (z === 8) {
                  //if z === 8, then break statement not reached: no options available

                  //Preferred adjacent swap (PAS)
                  //Swaps x for y (preference on unregistered numbers), finds occurence of y
                  //and swaps with z, etc. until an unregistered number has been found
                  let searchingNo = num;

                  //noting the location for the blindSwaps to prevent infinite loops.
                  let blindSwapIndex: boolean[] = new Array(81);

                  //loop of size 18 to prevent infinite loops as well. Max of 18 swaps are possible.
                  //at the end of this loop, if continue or break statements are not reached, then
                  //fail-safe is executed called Advance and Backtrack Sort (ABS) which allows the
                  //algorithm to continue sorting the next row and column before coming back.
                  //Somehow, this fail-safe ensures success.
                  for (let q = 0; q < 18; q++) {
                    SWAP: for (let b = 0; b <= j; b++) {
                      let pacing =
                        a % 2 === 0 ? rowOrigin + b : colOrigin + b * 9;
                      if (grid[pacing] === searchingNo) {
                        let adjacentCell = -1;
                        let adjacentNo = -1;
                        let decrement = a % 2 === 0 ? 9 : 1;
                        for (let c = 1; c < 3 - (i % 3); c++) {
                          adjacentCell =
                            pacing + (a % 2 === 0 ? (c + 1) * 9 : c + 1);

                          //this creates the preference for swapping with unregistered numbers
                          if (
                            (a % 2 === 0 && adjacentCell >= 81) ||
                            (a % 2 === 1 && adjacentCell % 9 === 0)
                          )
                            adjacentCell -= decrement;
                          else {
                            adjacentNo = grid[adjacentCell];
                            if (
                              i % 3 != 0 ||
                              c != 1 ||
                              blindSwapIndex[adjacentCell] ||
                              registered[adjacentNo]
                            )
                              adjacentCell -= decrement;
                          }
                          adjacentNo = grid[adjacentCell];

                          //as long as it hasn't been swapped before, swap it
                          if (!blindSwapIndex[adjacentCell]) {
                            blindSwapIndex[adjacentCell] = true;
                            grid[pacing] = adjacentNo;
                            grid[adjacentCell] = searchingNo;
                            searchingNo = adjacentNo;
                            if (!registered[adjacentNo]) {
                              registered[adjacentNo] = true;
                              continue ROW_COL;
                            }
                            break SWAP;
                          }
                        }
                      }
                    }
                  }

                  //begin Advance and Backtrack Sort (ABS)
                  backtrack = true;
                  break ROW_COL;
                }
              }
            }
          }
        }
      }
      if (a % 2 === 0 || typeof a == 'undefined')
        //setting row as sorted
        for (let j = 0; j < 9; j++) sorted[i * 9 + j] = true;
      else if (!backtrack) {
        for (let j = 0; j < 9; j++) sorted[i + j * 9] = true; //setting column as sorted
      } else {
        //reseting sorted cells through to the last iteration
        backtrack = false;
        for (let j = 0; j < 9; j++) sorted[i * 9 + j] = false;
        for (let j = 0; j < 9; j++) sorted[(i - 1) * 9 + j] = false;
        for (let j = 0; j < 9; j++) sorted[i - 1 + j * 9] = false;
        i -= 2;
      }
    }
  }
  if (!isPerfect(grid)) throw new Error('ERROR: Imperfect grid generated.');

  // Converts 1 Dimensional number array to 2 Dimensional String array
  let board: String[][] = [];
  let s = '';
  let temp: String[] = [];
  for (let i = 0; i < 81; i++) {
    if (i % 9 == 0 && i != 0) {
      board.push(temp);
      temp = [];
    }
    temp.push('' + grid[i]);
  }
  board.push(temp);
  return board;
}

function printGrid(grid: String[][]) {
  let x = '';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) x += '[' + grid[i][j] + ']';
    console.log(x);
    x = '';
  }
}

function isPerfect(grid: number[]): boolean {
  if (grid.length != 81) {
    throw new Error('The grid must be a single-dimension grid of length 81');
  }

  // Checking box
  for (let i = 0; i < 9; i++) {
    let registered: boolean[] = new Array(10);
    registered[0] = true;
    let boxOrigin = ((i * 3) % 9) + ~~((i * 3) / 9) * 27;
    for (let j = 0; j < 9; j++) {
      let boxStep = boxOrigin + ~~(j / 3) * 9 + (j % 3);
      let boxNum = grid[boxStep];
      registered[boxNum] = true;
    }
    for (let i = 0; i < registered.length; i++)
      if (!registered[i]) return false;
  }

  // Checking Row
  for (let i = 0; i < 9; i++) {
    let registered: boolean[] = new Array(10);
    registered[0] = true;
    let rowOrigin = i * 9;
    for (let j = 0; j < 9; j++) {
      let rowStep = rowOrigin + j;
      let rowNum = grid[rowStep];
      registered[rowNum] = true;
    }
    for (let i = 0; i < registered.length; i++)
      if (!registered[i]) return false;
  }

  // Checking Column
  for (let i = 0; i < 9; i++) {
    let registered: boolean[] = new Array(10);
    registered[0] = true;
    let colOrigin = i;
    for (let j = 0; j < 9; j++) {
      let colStep = colOrigin + j * 9;
      let colNum = grid[colStep];
      registered[colNum] = true;
    }
    for (let i = 0; i < registered.length; i++)
      if (!registered[i]) return false;
  }
  return true;
}

function createPuzzle(grid: String[][], num: number) {
  // Removes Mirror Pairs
  for (let i = 0; i < num; i++) {
    let p1 = ~~(Math.random() * 9);
    let p2 = ~~(Math.random() * 9);

    grid[p1][p2] = '.';
    grid[8 - p1][8 - p2] = '.';
  }
  return grid;
}

// TODO: Create a Hash Table to make sure same pairs arent being removed twice
// TODO: Test to see if there is a unique solution
function printPuzzle(grid: String[][]) {
  let x: String = '';
  for (let i = 0; i < 9; i++) {
    for (let ji = 0; ji < 9; i++) {
      x += '' + grid[i][ji];
    }
  }
  console.log(x);
}

function isCorrect(grid: String[][]) {
  // Converts 2 Dimensional String array to 1 dimensional number array so we can use the existing isPerfect() method

  let board: number[] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] == '.') {
        // If one of the boxes isn't filled in return false
        return false;
      } else board.push(Number(grid[i][j]));
    }
  }
  return isPerfect(board);
}

// Generates a filled board and removes box pairs.
let solved = generateGrid();
let pairsRemoved = 40;
let puzzle = createPuzzle(solved, pairsRemoved);

let timer = null;
// To keep track of selected tiles
let tileSelected = null;
let numberOrCandidate = true;

// Runs code everytime a window opens
window.onload = function () {
  setGame();
};

function setGame() {
  document.getElementById('remover').addEventListener('click', remover); // Run the remover method when the remove button is clicked
  document.addEventListener('keydown', keypress); // Run the keypress function when any key on the keyboard is used
  document.getElementById('numeros').classList.add('choice');
  document.getElementById('numeros').addEventListener('click', () => {
    document.getElementById('possibilites').classList.remove('choice');
    document.getElementById('numeros').classList.add('choice');
    numberOrCandidate = true;
  });
  document.getElementById('possibilites').addEventListener('click', () => {
    document.getElementById('numeros').classList.remove('choice');
    document.getElementById('possibilites').classList.add('choice');
    numberOrCandidate = false;
  });
  // Digits 1-9
  for (let i = 1; i <= 9; i++) {
    //<div id="1" class="number">1</div>
    let number = document.createElement('div');
    number.id = '' + i;
    number.innerText = '' + i;
    number.addEventListener('click', selectNumber); // Run the selectNumber function when the number is pressed
    number.classList.add('number');
    document.getElementById('digits').appendChild(number); // add this div under the digits id
  }
  // Board 9x9
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      //<div id="6-7" class="tile">1</div>
      let tile = document.createElement('div');
      tile.id = r.toString() + '-' + c.toString(); // id: rowNum-colNum
      if (puzzle[r][c] != '.') {
        // if it isn't empty add it to "tile-start" css property
        tile.innerText = '' + puzzle[r][c];
        tile.classList.add('tile-start');
      } else {
        tile.classList.add('threeXthree');
        tileSelected = tile;
      }
      if (r == 2 || r == 5) {
        tile.classList.add('horizontal-line'); //add dividers for the boxes
      }
      if (c == 2 || c == 5) {
        tile.classList.add('vertical-line'); //add dividers for the boxes
      }

      tile.addEventListener('click', selectTile);
      tile.classList.add('tile');
      document.getElementById('board').append(tile); // add div under board ID
    }
  }
  tileSelected = null;
  createTimer();
}

// Only goes up to  a day
function createTimer() {
  let secs = 0;
  let timey = '';
  let tempTimerString = '';
  timer = setInterval(function () {
    secs++;
    if (secs % 60 < 10) {
      tempTimerString = ':0';
    } else {
      tempTimerString = ':';
    }

    if (secs < 3600) timey = '' + ~~(secs / 60) + tempTimerString + (secs % 60);
    else {
      if (~~(~~(secs / 3600) % 60) < 10)
        timey =
          '' +
          ~~(secs / 3600) +
          ':0' +
          ~~(~~(secs / 3600) % 60) +
          tempTimerString +
          (secs % 60);
      else
        timey =
          '' +
          ~~(secs / 3600) +
          ':' +
          ~~(~~(secs / 3600) % 60) +
          tempTimerString +
          (secs % 60);
    }
    document.getElementById('timer').innerText = timey;
  }, 1000);
}

function selectNumber(e) {
  if (
    tileSelected &&
    !(
      tileSelected.classList.contains('tile-start') ||
      tileSelected.classList.contains('tile-start-and-selected')
    )
  ) {
    // Click Animation
    let btn = e.target;
    let boundingBox = btn.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY;
    let ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });

    // If there is a selected tile find its row and column using it s id
    let coords = tileSelected.id.split('-'); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    console.log(tileSelected.id + '-----------' + this.id);
    if (!numberOrCandidate) {
      document
        .getElementById(tileSelected.id + '-' + this.id)
        .classList.remove('transparent');
    } else {
      //Replace the tile's inner text to the id of the selected number
      tileSelected.classList.remove('threeXthree');
      tileSelected.innerText = this.id;

      //Update the puzzle array to reflect the change
      puzzle[tileSelected.id.split('-')[0]][tileSelected.id.split('-')[1]] =
        '' + this.id;

      //check if the change resulted in a win
      if (checkWin()) return;
    }
  }
}

function checkWin(): boolean {
  if (isCorrect(puzzle)) {
    document.getElementById('wins').innerText = 'You Win';
    rEL();
    clearInterval(timer); // Stops Timer
    return true;
  }
  return false;
}
//dsds
function selectTile() {
  // If another tile is selected remove it's "selected" css property
  if (tileSelected != null) {
    if (tileSelected.classList.contains('tile-start-and-selected')) {
      tileSelected.classList.remove('tile-start-and-selected');
      tileSelected.classList.add('tile-start');
    } else if (tileSelected.classList.contains('tile-selected')) {
      tileSelected.classList.remove('tile-selected');
      console.log('made');
      removeCandidates();
    }
  }
  // Make the instance variable the selected tile and give it the "seleted" css property
  tileSelected = this;
  if (tileSelected.classList.contains('tile-start'))
    tileSelected.classList.add('tile-start-and-selected');
  else tileSelected.classList.add('tile-selected');

  addCandidates();
}

function removeCandidates() {
  console.log('made');
  let hasCandidates = tileSelected.children.length == 9;
  console.log(hasCandidates);
  console.log (tileSelected.children);
  console.log( tileSelected.innerText == '');
  if (hasCandidates) {
    for (let i = 1; i < 10; i++) {
      console.log(tileSelected.id + '-' + i);
      let tempCandidate = document.getElementById(tileSelected.id + '-' + i);
      if (tempCandidate.classList.contains('transparent')) {
        tempCandidate.classList.remove('transparent');
        tempCandidate.classList.add('hidden');
      }
    }
  }
}

function addCandidates() {
  console.log('made');

  let hasCandidates = tileSelected.children.length == 9;
  console.log(hasCandidates);

  if (hasCandidates) {
    for (let i = 1; i < 10; i++) {
      let tempCandidate = document.getElementById(tileSelected.id + '-' + i);
      if (tempCandidate.classList.contains('hidden')) {
        tempCandidate.classList.remove('hidden');
        tempCandidate.classList.add('transparent');
      }
    }
  }

  if (!hasCandidates && !tileSelected.classList.contains('tile-start')) {
    for (let i = 1; i < 10; i++) {
      let candidates = document.createElement('div');
      candidates.classList.add('candidate');
      candidates.classList.add('transparent');
      candidates.innerText = '  ' + i;
      candidates.id = tileSelected.id + '-' + i;
      candidates.addEventListener('click', selectCandidate);
      tileSelected.append(candidates);
      console.log(candidates.id);
    }
    console.log(tileSelected.children);
  }
}

function selectCandidate() {
  let selectedCandidate = this;
  if (selectedCandidate.classList.contains('transparent'))
    selectedCandidate.classList.remove('transparent');
  else selectedCandidate.classList.add('transparent');
}

// Remove all Event listeners
function rEL() {
  document.getElementById('remover').removeEventListener('click', remover);
  document.removeEventListener('keydown', keypress);
  tileSelected.classList.remove('tile-selected');
  tileSelected = null;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      tile.removeEventListener('click', selectTile);
    }
  }
  for (let i = 1; i <= 9; i++) {
    let number = document.getElementById('' + i);
    number.removeEventListener('click', selectNumber);
  }
}

// TODO: Allow arrow keys to be used for navigation.
function keypress(e) {
  if (tileSelected != null) {
    // If there is a selected tile
    let coords = tileSelected.id.split('-');
    if (!isNaN(Number(e.key))) {
      // If the entered key is a nuber

      //if the tile is selected, you cannot modify the number inside
      if (
        tileSelected.classList.contains('tile-start') ||
        tileSelected.classList.contains('tile-start-and-selected')
      ) {
        return;
      }

      if (Number(e.key) != 0) {
        // If the number is not a 0
        tileSelected.classList.remove('threeXthree');
        tileSelected.innerText = e.key; // Make the inner text of the selected tile the key pressed
        puzzle[tileSelected.id.split('-')[0]][tileSelected.id.split('-')[1]] =
          '' + e.key; // Update the puzzle array to reflect this change
        //check if the change resulted in a win
        if (checkWin()) return;
      }
    } else if (e.key == 'Backspace' || e.key == 'Delete') {
      //if the tile is selected, you cannot delete the text inside
      if (
        tileSelected.classList.contains('tile-start') ||
        tileSelected.classList.contains('tile-start-and-selected')
      ) {
        return;
      }

      tileSelected.innerText = ''; // Remove the inner text
      tileSelected.classList.add('threeXthree');
      addCandidates();
      puzzle[tileSelected.id.split('-')[0]][tileSelected.id.split('-')[1]] =
        '.'; // Update the puzzle
    } else if (
      e.key == 'ArrowLeft' ||
      e.key == 'ArrowRight' ||
      e.key == 'ArrowUp' ||
      e.key == 'ArrowDown'
    ) {
      var newIDCoord = null;
      if (e.key == 'ArrowLeft') {
        //checks coordinate bounds so that you can't arrow out of the board
        if (coords[1] < 1) return;

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        removeCandidates();
        tileSelected.classList.remove('tile-selected');
        if (tileSelected.classList.contains('tile-start-and-selected')) {
          tileSelected.classList.remove('tile-start-and-selected');
          tileSelected.classList.add('tile-start');
        tileSelected.classList.remove('threeXthree');

        }

        //calculates new coordinates
        newIDCoord = coords[0] + '-' + (parseInt(coords[1]) - 1);
      } else if (e.key == 'ArrowRight') {
        //checks coordinate bounds so that you can't arrow out of the board
        if (coords[1] > 7) return;

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        removeCandidates();
        tileSelected.classList.remove('tile-selected');
        if (tileSelected.classList.contains('tile-start-and-selected')) {
          tileSelected.classList.remove('tile-start-and-selected');
          tileSelected.classList.add('tile-start');
        tileSelected.classList.remove('threeXthree');
      }
        //calculates new coordinates
        newIDCoord = coords[0] + '-' + (parseInt(coords[1]) + 1);
      } else if (e.key == 'ArrowUp') {
        //checks coordinate bounds so that you can't arrow out of the board
        if (coords[0] < 1) return;

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        removeCandidates();
        tileSelected.classList.remove('tile-selected');
        if (tileSelected.classList.contains('tile-start-and-selected')) {
          tileSelected.classList.remove('tile-start-and-selected');
          tileSelected.classList.add('tile-start');
        tileSelected.classList.remove('threeXthree');
      }
        //calculates new coordinates
        newIDCoord = parseInt(coords[0]) - 1 + '-' + coords[1];
      } else if (e.key == 'ArrowDown') {
        //checks coordinate bounds so that you can't arrow out of the board
        if (coords[0] > 7) return;

        //Makes the current selected tile unselected (if it's selected and a start tile, it just makes it a start tile)
        removeCandidates();
        tileSelected.classList.remove('tile-selected');
        if (tileSelected.classList.contains('tile-start-and-selected')) {
          tileSelected.classList.remove('tile-start-and-selected');
          tileSelected.classList.add('tile-start');
        tileSelected.classList.remove('threeXthree');
      }
        //calculates new coordinates
        newIDCoord = parseInt(coords[0]) + 1 + '-' + coords[1];
      }

      //gets new tile element
      var newTile = document.getElementById(newIDCoord);

      //adds the 'selected' property to the tile (if it's a start tile, add tile-start-and-selected property)
      if (newTile.classList.contains('tile-start')) {
        newTile.classList.remove('tile-start');
        newTile.classList.add('tile-start-and-selected');
        tileSelected.classList.remove('threeXthree');
      } else {
        
        newTile.classList.add('tile-selected');
      }

      //sets tileSelected to the new tile
      tileSelected = document.getElementById(newIDCoord);
      if (tileSelected.classList.contains('threeXthree'))
        addCandidates();
    }
  }
}

function remover(e) {
  if (
    tileSelected &&
    !(
      tileSelected.classList.contains('tile-start') ||
      tileSelected.classList.contains('tile-start-and-selected')
    )
  ) {
    // Click effect
    let btn = e.target;
    let boundingBox = btn.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY;
    let ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });

    // Remove inner text and update puzzle
    if (
      tileSelected.classList.contains('tile-start') ||
      tileSelected.classList.contains('tile-start-and-selected')
    ) {
      return;
    }

    tileSelected.innerText = ''; // Remove the inner text
    tileSelected.classList.add('threeXthree');
    addCandidates();
    puzzle[tileSelected.id.split('-')[0]][tileSelected.id.split('-')[1]] =
      '.'; 
  }
}
