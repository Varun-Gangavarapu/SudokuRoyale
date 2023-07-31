function generateSolved() {
    var numbers1To9 = new Array(9);
    var grid = new Array(81);
    // Populating number collection
    for (var i = 1; i <= 9; i++)
        numbers1To9[i - 1] = i;
    //loads all boxes(3x3) in grid with numbers 1 through 9
    for (var i = 0; i < 81; i++) {
        // Shuffle the number collection once a box is filled
        if (i % 9 === 0) {
            numbers1To9.sort(function () { return Math.random() - 0.5; });
        }
        var perBox = (~~(i / 3) % 3) * 9 + ~~(~~(i % 27) / 9) * 3 + ~~(i / 27) * 27 + (i % 3); // Box formula
        grid[perBox] = numbers1To9[i % 9];
    }
    // tracks rows and columns that have been sorted
    var sorted = new Array(81);
    for (var i = 0; i < 9; i++) {
        var backtrack = false;
        //0 is row, 1 is column
        for (var a = 0; a < 2; a++) {
            //every number 1-9 that is encountered is registered
            var registered = new Array(10); //index 0 will letentionally be left empty since there are only number 1-9.
            var rowOrigin = i * 9;
            var colOrigin = i;
            ROW_COL: for (var j = 0; j < 9; j++) {
                //row/column stepping - making sure numbers are only registered once and marking which cells have been sorted
                var step = a % 2 === 0 ? rowOrigin + j : colOrigin + j * 9;
                var num = grid[step];
                if (!registered[num])
                    registered[num] = true;
                else {
                    //if duplicate in row/column
                    //box and adjacent-cell swap (BAS method)
                    //checks for either unregistered and unsorted candidates in same box,
                    //or unregistered and sorted candidates in the adjacent cells
                    for (var y = j; y >= 0; y--) {
                        var scan = a % 2 === 0 ? i * 9 + y : i + 9 * y;
                        if (grid[scan] === num) {
                            //box stepping
                            for (var z = a % 2 === 0 ? ((i % 3) + 1) * 3 : 0; z < 9; z++) {
                                if (a % 2 === 1 && z % 3 <= i % 3)
                                    continue;
                                var boxOrigin = ~~((scan % 9) / 3) * 3 + ~~(scan / 27) * 27;
                                var boxStep = boxOrigin + ~~(z / 3) * 9 + (z % 3);
                                var boxNum = grid[boxStep];
                                if ((!sorted[scan] && !sorted[boxStep] && !registered[boxNum]) ||
                                    (sorted[scan] &&
                                        !registered[boxNum] &&
                                        (a % 2 === 0
                                            ? boxStep % 9 === scan % 9
                                            : ~~(boxStep / 9) === ~~(scan / 9)))) {
                                    grid[scan] = boxNum;
                                    grid[boxStep] = num;
                                    registered[boxNum] = true;
                                    continue ROW_COL;
                                }
                                else if (z === 8) {
                                    //if z === 8, then break statement not reached: no options available
                                    //Preferred adjacent swap (PAS)
                                    //Swaps x for y (preference on unregistered numbers), finds occurence of y
                                    //and swaps with z, etc. until an unregistered number has been found
                                    var searchingNo = num;
                                    //noting the location for the blindSwaps to prevent infinite loops.
                                    var blindSwapIndex = new Array(81);
                                    //loop of size 18 to prevent infinite loops as well. Max of 18 swaps are possible.
                                    //at the end of this loop, if continue or break statements are not reached, then
                                    //fail-safe is executed called Advance and Backtrack Sort (ABS) which allows the
                                    //algorithm to continue sorting the next row and column before coming back.
                                    //Somehow, this fail-safe ensures success.
                                    for (var q = 0; q < 18; q++) {
                                        SWAP: for (var b = 0; b <= j; b++) {
                                            var pacing = a % 2 === 0 ? rowOrigin + b : colOrigin + b * 9;
                                            if (grid[pacing] === searchingNo) {
                                                var adjacentCell = -1;
                                                var adjacentNo = -1;
                                                var decrement = a % 2 === 0 ? 9 : 1;
                                                for (var c = 1; c < 3 - (i % 3); c++) {
                                                    adjacentCell =
                                                        pacing + (a % 2 === 0 ? (c + 1) * 9 : c + 1);
                                                    //this creates the preference for swapping with unregistered numbers
                                                    if ((a % 2 === 0 && adjacentCell >= 81) ||
                                                        (a % 2 === 1 && adjacentCell % 9 === 0))
                                                        adjacentCell -= decrement;
                                                    else {
                                                        adjacentNo = grid[adjacentCell];
                                                        if (i % 3 != 0 ||
                                                            c != 1 ||
                                                            blindSwapIndex[adjacentCell] ||
                                                            registered[adjacentNo])
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
                for (var j = 0; j < 9; j++)
                    sorted[i * 9 + j] = true;
            else if (!backtrack) {
                for (var j = 0; j < 9; j++)
                    sorted[i + j * 9] = true; //setting column as sorted
            }
            else {
                //reseting sorted cells through to the last iteration
                backtrack = false;
                for (var j = 0; j < 9; j++)
                    sorted[i * 9 + j] = false;
                for (var j = 0; j < 9; j++)
                    sorted[(i - 1) * 9 + j] = false;
                for (var j = 0; j < 9; j++)
                    sorted[i - 1 + j * 9] = false;
                i -= 2;
            }
        }
    }
    if (!isPerfect(grid))
        throw new Error('ERROR: Imperfect grid generated.');
    // Converts 1 Dimensional number array to 2 Dimensional String array
    var board = [];
    var s = '';
    var temp = [];
    for (var i = 0; i < 81; i++) {
        if (i % 9 == 0 && i != 0) {
            board.push(temp);
            temp = [];
        }
        temp.push('' + grid[i]);
    }
    board.push(temp);
    return board;
}

function isPerfect(grid) {
    if (grid.length != 81) {
        throw new Error('The grid must be a single-dimension grid of length 81');
    }
    // Checking box
    for (var i = 0; i < 9; i++) {
        var registered = new Array(10);
        registered[0] = true;
        var boxOrigin = ((i * 3) % 9) + ~~((i * 3) / 9) * 27;
        for (var j = 0; j < 9; j++) {
            var boxStep = boxOrigin + ~~(j / 3) * 9 + (j % 3);
            var boxNum = grid[boxStep];
            registered[boxNum] = true;
        }
        for (var i_1 = 0; i_1 < registered.length; i_1++)
            if (!registered[i_1])
                return false;
    }
    // Checking Row
    for (var i = 0; i < 9; i++) {
        var registered = new Array(10);
        registered[0] = true;
        var rowOrigin = i * 9;
        for (var j = 0; j < 9; j++) {
            var rowStep = rowOrigin + j;
            var rowNum = grid[rowStep];
            registered[rowNum] = true;
        }
        for (var i_2 = 0; i_2 < registered.length; i_2++)
            if (!registered[i_2])
                return false;
    }
    // Checking Column
    for (var i = 0; i < 9; i++) {
        var registered = new Array(10);
        registered[0] = true;
        var colOrigin = i;
        for (var j = 0; j < 9; j++) {
            var colStep = colOrigin + j * 9;
            var colNum = grid[colStep];
            registered[colNum] = true;
        }
        for (var i_3 = 0; i_3 < registered.length; i_3++)
            if (!registered[i_3])
                return false;
    }
    return true;
}
function createPuzzle(grid, num) {
    // Removes Mirror Pairs
    for (var i = 0; i < num; i++) {
        var p1 = ~~(Math.random() * 9);
        var p2 = ~~(Math.random() * 9);
        grid[p1][p2] = '.';
        grid[8 - p1][8 - p2] = '.';
    }
    return grid;
}


// Generates a filled board and removes box pairs.
export const solved = generateSolved();
let temp = solved.map(function(arr) {
    return arr.slice();
});
let pairsRemoved = 20;
export const puzz = createPuzzle(temp, pairsRemoved);

