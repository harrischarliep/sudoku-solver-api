const puzzleSize = 9;
const squareSize = puzzleSize / 3;
const maxIterations = 10;

// TODO: move these into a separate utils module
const divInt = (x, y) => Math.floor(x / y);
const copy = arr => {
    return arr.map(e => e.slice());
}
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
    // console.log('************************** InitPossibleValues **************************');
    // console.log(rows);

    const allPossibleVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const possibleVals = [];
    let remaining = puzzleSize ** 2;
    for (let r = 0; r < puzzleSize; r++) {
        const row = [];
        for (let c = 0; c < puzzleSize; c++) {
            const col = [];
            const val = rows[r][c];
            if (val) {
                col.push([val]);
                remaining--;
            } else {
                col.push(...allPossibleVals);
            }
            console.log(`col length: ${col.length}`);
            row.push(col);
        }
        possibleVals.push(row);
    }
    
    // logPossible(possibleVals);
    // console.log('************************** InitPossibleValues **************************');

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
        console.log(`**************** ITERATION ${iteration + 1} ****************`);
        // prettyPrint(rows, "rows");
        // prettyPrint(cols, "cols");
        // prettyPrint(squares, "squares");
        // logPossible(possibleVals);

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

                // console.log(`inRow: ${inRow}`);
                // console.log(`inCol${inCol}`);
                // console.log(`inSquare: ${inSquare}`);
    
                console.log(`BEFORE possibleVals[${r}][${c}]=${possibleVals[r][c]}`);
                possibleVals[r][c] = [...possibleVals[r][c]].filter(e => !inRow.includes(e) && !inCol.includes(e) && !inSquare.includes(e));
                console.log(`AFTER possibleVals[${r}][${c}]=${possibleVals[r][c]}`);
                if (possibleVals[r][c].length == 1) {
                    const val = possibleVals[r][c][0];
                    // console.log(`updating val: ${val}`);
                    // console.log(`BEFORE rows: ${rows[rowR][rowC]}, cols: ${cols[colR][colC]}, squares: ${squares[squareR][squareC]}, remaining: ${remaining}`);
                    rows[rowR][rowC] = val;
                    cols[colR][colC] = val;
                    squares[squareR][squareC] = val;
                    remaining--;
                    // console.log(`AFTER rows: ${rows[rowR][rowC]}, cols: ${cols[colR][colC]}, squares: ${squares[squareR][squareC]}, remaining: ${remaining}`);
                    console.log(`Resolved (${r}, ${c}) => ${val}, iteration #${iteration}, ${remaining} remaining`);
                }
            }
        }
        if (remaining === 0) {
            solved = true;
        }
        iteration++;

        console.log(`***********************************************************\n\n\n`);

        // prettyPrint(rows);
    }

    return {
        solved: solved,
        iterations: iteration,
        solution: solved ? rows : rows,
        puzzle: puzzle,
    };
}


// TODO: remove logging
const logPossible = possibleVals => {
    console.log("Possible values: ");
    for (let r = 0; r < puzzleSize; r++) {
        for (let c = 0; c < puzzleSize; c++) {
            const vals = possibleVals[r][c];
            console.log(`\t (${r}, ${c}) => ${vals}`);
        }
    }
}

const prettyPrint = (arr, tag) => {
    console.log(tag);
    arr.forEach(e => console.log(`\t ${e}`));
    // logMarker();
    // for (let r = 0; r < puzzleSize; r++) {
    //     let line;
    //     for (let c = 0; c < puzzleSize; c++) {
    //         if (c % squareSize == 0) {
    //             line += '\t';
    //         }
    //         line += rows[r][c] + ' ';
    //     }
    //     if (r % squareSize == 0) {
    //         console.log('\n');
    //         console.log(line);
    //     }
    // }
    // logMarker();
}

const logMarker = () => console.log('**********************************************************');
//


module.exports = solve;


/*
row: 
[
    [(r0c0, r0c1, r0c2)     (r0c3 r0c4 r0c5)    (roc6 r0c7 r0c8)],
    [(r1c0, r1c1, r1c2)     (r1c3 r1c4 r1c5)    (r1c6 r1c7 r1c8)],
    [(r2c0, r2c1, r2c2)     (r2c3 r2c4 r2c5)    (r2c6 r2c7 r2c8)],

    [(r3c0, r3c1, r3c2)     (r3c3 r3c4 r3c5)    (r3c6 r3c7 r3c8)],
    [(r4c0, r4c1, r4c2)     (r4c3 r4c4 r4c5)    (r4c6 r4c7 r4c8)],
    [(r5c0, r5c1, r5c2)     (r5c3 r5c4 r5c5)    (r5c6 r5c7 r5c8)],

    [(r6c0, r6c1, r6c2)     (r6c3 r6c4 r6c5)    (r6c6 r6c7 r6c8)],
    [(r7c0, r7c1, r7c2)     (r7c3 r7c4 r7c5)    (r7c6 r7c7 r7c8)],
    [(r8c0, r8c1, r8c2)     (r8c3 r8c4 r0c5)    (r8c6 r8c7 r8c8)],
]
*/

/*

square:
[
    [r0c0, r0c1, r0c2, r1c0, r1c1, r1c2, r2c0, r2c1, r2c2],
    ...
]

*/

    // const updateRows = (rowR, rowC, val) => {
    //     rows[rowR][rowC] = val;
        
    //     const [colR, colC] = rowToColCoords(rowR, rowC);
    //     cols[colR][colC] = val;

    //     const [squareR, squareC] = rowToSquareCoords(rowR, rowC);
    //     squares[squareR][squareC] = val;
    // }

    // const updateCols = (colR, colC, val) => {
    //     cols[colR][colC] = val;

    //     const [rowR, rowC] = colToRowCoords(colR, colC);
    //     rows[rowR][rowC] = val;

    //     const [squareR, squareC] = rowToSquareCoords(rowR, rowC);
    //     squares[squareR][squareC] = val;
    // }

    // const updateSquares = (squareR, squareC, val) => {
    //     squares[squareR][squareC] = val;

    //     const [rowR, rowC] = squareToRowCoords(squareR, squareC);
    //     rows[rowR][rowC] = val;

    //     const [colR, colC] = rowToColCoords(rowR, rowC);
    //     cols[colR][colC] = val;
    // }