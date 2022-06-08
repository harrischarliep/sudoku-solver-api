const express = require('express');
const router = express.Router();
const solve = require('../../src/solve.js');

router.get('/test', (req, res) => res.send('solve test'));

router.post('/', (req, res) => {
    const {puzzle} = req.body;
    const solved = solve(puzzle);
    if (solved) {
        res.send({
            status: "success",
            solution: solved,
        });
    } else {
        res.send({status: "failed to solve puzzle"});
    }
});

module.exports = router;
