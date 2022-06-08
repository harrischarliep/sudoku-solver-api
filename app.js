const express = require('express');
const solve = require('./src/solve.js')
const puzzle = require('./routes/api/puzzle');
;

const app = express();

// const puzzle = 
// [
    // [null,  null,   4,          null,   null,   9,          6,      5,      null],
    // [8,     5,      7,          6,      null,   null,       null,   null,   4],
    // [null,  3,      null,       null,   null,   null,       8,      7,      1],

    // [null,  null,   8,          null,   null,   null,       null,   null,   null],
    // [null,  6,      9,          4,      7,      8,          1,      3,      null],
    // [null,  null,   null,       null,   null,   null,       4,      null,   null],

    // [2,     9,      5,          null,   null,   null,       null,   4,      null],
    // [7,     null,   null,       null,   null,   5,          9,      1,      6],
    // [null,  8,      1,          3,      null,   null,       5,      null,   null]
// ];
// solve(puzzle);

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => console.log('Hello, world!'));

app.use('/api/puzzle', puzzle);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Listening on port ${port}`));
