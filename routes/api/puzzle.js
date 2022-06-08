const express = require('express');
const router = express.Router();
const solve = require('../../src/better-solve.js');

router.get('/test', (req, res) => res.send('solve test'));

router.post('/', (req, res) => {
    const {puzzle} = req.body;
    res.send(solve(puzzle));
});

module.exports = router;
