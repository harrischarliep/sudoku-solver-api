const puzzleSize = 9;
const squareSize = puzzleSize / 3;
let solveId = 0; // unique integer identifying a solve instance, used only for logging

// TODO: move these into a separate utils module
const divInt = (x, y) => Math.floor(x / y);
const copy = arr => arr.map(e => e.slice());
const invertCopy = arr => {
    const inverted = [];
    for (let c = 0; c < puzzleSize; c++) {
        const col = [];
        for (let r = 0; r < puzzleSize; r++) {
            col.push(arr[r][c]);
        }
        inverted.push(col);
    }
    return inverted;
}
//

const getRows = copy;

const getCols = invertCopy;

const getSquares = arr => {
    const squareArr = [];
    for (let sr = 0; sr < squareSize; sr++) {
        for (let sc = 0; sc < squareSize; sc++) {
            const initR = sr * squareSize;
            const initC = sc * squareSize;
            square = [];
            for (let r = initR; r < initR + squareSize; r++) {
                for (let c = initC; c < initC + squareSize; c++) {
                    square.push(arr[r][c]);
                }
            }
            squareArr.push(square);
        }
    }
    return squareArr;
}

const rowToColCoords = (rowR, rowC) => [rowC, rowR];

// TODO: memoize these so we dont have to repeat the calculations over and over again
const rowToSquareCoords = (rowR, rowC) => {
    const quotR = divInt(rowR, squareSize);
    const quotC = divInt(rowC, squareSize);
    const squareR = (quotR * squareSize) + quotC;

    const remR = rowR % squareSize; 
    const remC = rowC % squareSize;
    const squareC = (remR * squareSize) + remC;
    return [squareR, squareC];
}


const initPossibleVals = rows => {
    const init3DArray = () => {
        const arr1 = [];
        for (let i1 = 0; i1 < puzzleSize; i1++) {
          const arr2 = [];
          for (let i2 = 0; i2 < puzzleSize; i2++) {
            arr2.push([]);
          }
          arr1.push(arr2);
        }
        return arr1;
    }

    let remaining = puzzleSize ** 2;
    const allPossibleVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const possibleValsRows = init3DArray();
    const possibleValsCols = init3DArray();
    const possibleValsSquares = init3DArray();
    for (let r = 0; r < puzzleSize; r++) {
        for (let c = 0; c < puzzleSize; c++) {
            const val = rows[r][c];
            const possibleLst = val ? remaining-- && [val] : [...allPossibleVals];

            const [rowR, rowC] = [r, c];
            possibleValsRows[rowR][rowC] = [...possibleLst];

            const [colR, colC] = rowToColCoords(rowR, rowC);
            possibleValsCols[colR][colC] = [...possibleLst];

            const [squareR, squareC] = rowToSquareCoords(rowR, rowC);
            possibleValsSquares[colR][colC] = [...possibleLst];
        }
    }

    return [possibleValsRows, possibleValsCols, possibleValsSquares, remaining];

    // for (let r = 0; r < puzzleSize; r++) {
    //     const row = [];
    //     for (let c = 0; c < puzzleSize; c++) {
    //         const val = rows[r][c];
    //         const col = val ? remaining-- && [val] : [...allPossibleVals];
    //         row.push(col);
    //     }
    //     possibleValsRows.push(row);
    // }

    

    // return [possibleVals, remaining];
}

// TODO: clean up logging
// TODO: use maxRecursiveDepth parameter, for now only going to a depth of 1
const solve = (puzzle, maxIterations, maxRecursiveDepth) => {
    console.log(`solve ${++solveId}, maxIterations: ${maxIterations}, maxRecursiveDepth: ${maxRecursiveDepth}, puzzle: ${puzzle}`);
    const bruteForceSolution = bruteForce(puzzle, maxIterations);
    if (bruteForceSolution.solved || bruteForceSolution.unsolvable) {
        console.log(`solve ${solveId}, finished after brute force, solved: ${bruteForceSolution.solved}, unsolvable: ${bruteForceSolution.unsolvable}`);
        return bruteForceSolution;
    }

    console.log(`solve ${solveId}, ${bruteForceSolution.remaining} tiles remaining after brute force, attempting recursive solve`);
    const partial = bruteForceSolution.solution;
    const possibleVals = bruteForceSolution.possibleVals;
    for (let r = 0; r < puzzleSize; r++) {
        for (let c = 0; c < puzzleSize; c++) {
            // TODO: what if there are none with only 2 possible values? Instead find tile with fewest.  For now though this will probably work in most cases
            if (possibleVals[r][c].length === 2) {
                possibleVals[r][c].forEach(v => {
                    const partialCopy = copy(partial);
                    partialCopy[r][c] = v;
                    console.log(`solve ${solveId} attempting brute force for [${r}, ${c}] => ${v} with ${bruteForceSolution.remaining} remaining, partial: ${partialCopy}`);
                    const solution = bruteForce(partialCopy, maxIterations);
                    if (solution.solved) {
                        console.log(`solve ${solveId}, brute force successful for [${r}, ${c}] => ${v}`);
                        return solution;
                    } else if (solution.unsolvable) {
                        console.log(`solve ${solveId}, [${r}, ${c}] => ${v} unsolvable`);
                    } else {
                        console.log(`solve ${solveId}, brute force for [${r}, ${c}] => ${v} inconclusive, ${solution.remaining}`);
                    }
                })
            }
        }
    }

    console.log(`solve: ${solveId}, recursion failed, returning brute force partial solution`);
    return bruteForceSolution;
}

/*
Determines as many tile values as possible through brute force means. Maintains three lists: rows, columns, and 3x3 squares.
These lists are essentially each a copy of the puzzle with information displayed slightly differently.  As such, they must be
kept in sync. It is far simpler to check which values are missing for a row/col/square when the corresponding rows/cols/squares
are already grouped together, while the additional memory overhead is minimal since the puzzle size is fixed. 

May not be sufficient to fully solve a puzzle.

Returns:
{
    solved: boolean denoting whether the puzzle is fully solved,
    unsolvable: boolean denoting whether the puzzle cannot be solved, e.g. because of having two of the same number in one column
    iterations: the number of loop iterations it took,
    remaining: the number of tiles left to solve,
    solution: the resulting partial solution after filling in as many tiles as possible (complete solution if able to fully solve),
    possibleVals: array of possible values for each tile
    puzzle: the original puzzle, untouched
}

*/
const bruteForce = (puzzle, maxIterations) => {
    const rows = getRows(puzzle);
    const cols = getCols(puzzle);
    const squares = getSquares(puzzle);

    let [possibleValsRows, possibleValsCols, possibleValsSquares, remaining] = initPossibleVals(rows);
    let solved = false;
    let unsolvable = false;
    let iteration = 0;
    while (!solved && !unsolvable && iteration < maxIterations) {
        const prevRemaining = remaining;

        // Eliminate possibilities
        for (let r = 0; r < puzzleSize; r++) {
            for (let c = 0; c < puzzleSize; c++) {
                if (possibleValsRows[r][c].length === 1) {
                    continue;
                }
    
                const [rowR, rowC] = [r, c];
                const inRow = [...rows[rowR]].filter(e => e); // filter out null/undefined
    
                const [colR, colC] = rowToColCoords(rowR, rowC);
                const inCol = [...cols[colR]].filter(e => e);
    
                const [squareR, squareC] = rowToSquareCoords(rowR, rowC);
                const inSquare = [...squares[squareR]].filter(e => e);

                possibleValsRows[r][c] = [...possibleValsRows[r][c]].filter(e => !inRow.includes(e) && !inCol.includes(e) && !inSquare.includes(e));
                possibleValsCols[colR][colC] = [...possibleValsRows[r][c]];
                possibleValsSquares[squareR, squareC] = [...possibleValsRows[r][c]];
                if (possibleValsRows[r][c].length === 1) {
                    const val = possibleValsRows[r][c][0];
                    rows[rowR][rowC] = val;
                    cols[colR][colC] = val;
                    squares[squareR][squareC] = val;
                    remaining--;
                } else if (possibleValsRows[r][c].length === 0) {
                    unsolvable = true;
                }                
            }
        }        

        // Extrapolate
        for (let r = 0; r < puzzleSize; r++) {
            for (let val = 1; val <= 9; val++)  {

                // Rows
                let cols = [];
                for (let c = 0; c < puzzleSize; c++) {
                    if (possibleValsRows[r][c].length > 1 && possibleValsRows[r][c].contains(val)) {
                        cols.push(c);
                    }
                }
                if (cols.length === 1) {

                }

            }
        }
        

        solved = remaining === 0;
        iteration++;

        // If no progress was made this loop, then no progress will be made in successive loops, so exit early
        if (prevRemaining === remaining) {
            break;
        }
    }

    return {
        solved: solved,
        unsolvable: unsolvable,
        iterations: iteration,
        remaining: remaining,
        solution: rows,
        possibleVals: possibleValsRows,
        puzzle: puzzle,
    };
}

module.exports = solve;
