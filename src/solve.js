const puzzleSize = 9;
const squareSize = puzzleSize / 3;
const maxIterations = 100;

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
    const allPossibleVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const possibleVals = [];
    let remaining = puzzleSize ** 2;
    for (let r = 0; r < puzzleSize; r++) {
        const row = [];
        for (let c = 0; c < puzzleSize; c++) {
            const val = rows[r][c];
            const col = val ? remaining-- && [val] : [...allPossibleVals];
            row.push(col);
        }
        possibleVals.push(row);
    }

    return [possibleVals, remaining];
}

const solve = puzzle => {
    const rows = getRows(puzzle);
    const cols = getCols(puzzle);
    const squares = getSquares(puzzle);

    let [possibleVals, remaining] = initPossibleVals(rows);
    let solved = false;
    let iteration = 0;
    while (!solved && iteration < maxIterations) {
        for (let r = 0; r < puzzleSize; r++) {
            for (let c = 0; c < puzzleSize; c++) {
                if (possibleVals[r][c].length === 1) {
                    continue;
                }
    
                const [rowR, rowC] = [r, c];
                const inRow = [...rows[rowR]].filter(e => e); // filter out null/undefined
    
                const [colR, colC] = rowToColCoords(rowR, rowC);
                const inCol = [...cols[colR]].filter(e => e);
    
                const [squareR, squareC] = rowToSquareCoords(rowR, rowC);
                const inSquare = [...squares[squareR]].filter(e => e);

                possibleVals[r][c] = [...possibleVals[r][c]].filter(e => !inRow.includes(e) && !inCol.includes(e) && !inSquare.includes(e));
                if (possibleVals[r][c].length == 1) {
                    const val = possibleVals[r][c][0];
                    rows[rowR][rowC] = val;
                    cols[colR][colC] = val;
                    squares[squareR][squareC] = val;
                    remaining--;
                }
            }
        }
        if (remaining === 0) {
            solved = true;
        }
        iteration++;
    }

    return {
        solved: solved,
        iterations: iteration,
        solution: solved ? rows : rows,
        puzzle: puzzle,
    };
}

module.exports = solve;
