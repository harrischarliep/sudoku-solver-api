const express = require('express');
const router = express.Router();
const solve = require('../../src/solve.js');
const maxIterations = 100;
const maxRecursiveDepth = 1;

router.get('/test', (req, res) => res.send('solve test'));

// TODO: add parameters: maxIterations, maxRecursiveDepth
router.post('/', (req, res) => {
    const {puzzle} = req.body;
    res.send(solve(puzzle, maxIterations, maxRecursiveDepth));
});

module.exports = router;
