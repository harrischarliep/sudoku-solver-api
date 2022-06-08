/*
puzzle: 
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

const puzzleSize = 9;
const squareSize = puzzleSize / 3;
const maxIterations = 100;

/*
 *  Returns:
 *    {
 *      puzzle: the original puzzle,
 *      solution: the solution, or null if failed to solve,
 *      iterations: number of iterations it took to solve
 *    }
 */
const solve = puzzle => {
    const originalPuzzle = copy(puzzle);

    /*
     *  Construct array of possible answers.  If an element at (r, c) is null, then the corresponding tile at (r, c)
     *  in the puzzle is already filled in.
     */
    let possible = [...initPossible(puzzle)];

    let solved = false;
    let iterations = 0;
    while (!solved && iterations++ < maxIterations) {
        const initPuzzle = copy(puzzle);

        /*
         *  Eliminate possibilities by row
         */
        for (let r = 0; r < puzzleSize; r++) {
            const inRow = [...puzzle[r]].filter(e => e);
            for (let c = 0; c < puzzleSize; c++) {
                if (possible[r][c].length > 1) {
                    possible[r][c] = [...possible[r][c]].filter(e => !inRow.includes(e));
                }
            }
        }

        /*
         *  Eliminate possibilities by column
         */
        for (let c = 0; c < puzzleSize; c++) {
            const inCol = []
            for (let r = 0; r < puzzleSize; r++) {
                if (puzzle[r][c]) {
                    inCol.push(puzzle[r][c]);
                }
            }
            for (let r = 0; r < puzzleSize; r++) {
                if (possible[r][c].length > 1) {
                    possible[r][c] = [...possible[r][c]].filter(e => !inCol.includes(e));
                }
            }
        }

        /*
         *  Eliminate possibilities by square
         */
        for (let sr = 0; sr < squareSize; sr++) {
            for (let sc = 0; sc < squareSize; sc++) {
                const inSquare = []
                const initR = sr * squareSize;
                const initC = sc * squareSize;
                for (let r = initR; r < initR + squareSize; r++) {
                    for (let c = initC; c < initC + squareSize; c++) {
                        if (puzzle[r][c]) {
                            inSquare.push(puzzle[r][c]);
                        }
                    }
                }
                for (let r = initR; r < initR + squareSize; r++) {
                    for (let c = initC; c < initC + squareSize; c++) {
                        if (possible[r][c].length > 1) {
                            possible[r][c] = [...possible[r][c]].filter(e => !inSquare.includes(e));
                        }
                    }
                }
            }
        }

        /*
         *  Reduce puzzle
        */
        for (let r = 0; r < puzzleSize; r++) {
            for (let c = 0; c < puzzleSize; c++) {
                const p = possible[r][c];
                if (p.length == 1) {
                    puzzle[r][c] = p[0];
                }
            }
        }

        /*
         *  Check if solved
         */
        solved = isSolved(puzzle);
        if (solved) {
            return {
                puzzle: originalPuzzle,
                solution: puzzle,
                iterations: iterations,
            };
        }

        if (puzzlesEqual(initPuzzle, puzzle)) {
            return {
                puzzle: originalPuzzle,
                iterations: iterations,
            };
        }
    }

    return {
        puzzle: originalPuzzle,
        iterations: iterations,
    };;
}

const isSolved = (puzzle) => {
    for (let r = 0; r < puzzleSize; r++) {
        for (let c = 0; c < puzzleSize; c++) {
            if (!puzzle[r][c]) {
                return false;
            }
        }
    }
    return true;
}

const initPossible = (puzzle) => {
    const possible = []
    for (let r = 0; r < puzzleSize; r++) {
        const row = []
        for (let c = 0; c < puzzleSize; c++) {
            const p = []
            if (puzzle[r][c]) {
                p.push(puzzle[r][c]);
            } else {
                for (let i = 1; i <= puzzleSize; i++) {
                    p.push(i);
                }
            }
            row.push(p);
        }
        possible.push(row);
    }
    return possible;
}

const puzzlesEqual = (p1, p2) => {
    for (let r = 0; r < puzzleSize; r++) {
        for (let c = 0; c < puzzleSize; c++) {
            if (p1[r][c] !== p2[r][c]) {
                return false;
            }
        }
    }
    return true;
}

const copy = (arr) => {
    return arr.map(e => e.slice());
}

module.exports = solve;
