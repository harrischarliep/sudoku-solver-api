const express = require('express');
const router = express.Router();
// const solve = require('../../src/solve.js');
const solve = require('../../src/better-solve.js');

router.get('/test', (req, res) => res.send('solve test'));

router.post('/', (req, res) => {
    const {puzzle} = req.body;
    res.send(solve(puzzle));
});

module.exports = router;

// {
//     "puzzle": [
//     [null,  null,   4,          null,   null,   9,          6,      5,      null],
//     [8,     5,      7,          6,      null,   null,       null,   null,   4],
//     [null,  3,      null,       null,   null,   null,       8,      7,      1],

//     [null,  null,   8,          null,   null,   null,       null,   null,   null],
//     [null,  6,      9,          4,      7,      8,          1,      3,      null],
//     [null,  null,   null,       null,   null,   null,       4,      null,   null],

//     [2,     9,      5,          null,   null,   null,       null,   4,      null],
//     [7,     null,   null,       null,   null,   5,          9,      1,      6],
//     [null,  8,      1,          3,      null,   null,       5,      null,   null]
//     ]
// }
