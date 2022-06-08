const express = require('express');
const solve = require('./src/solve.js')
const puzzle = require('./routes/api/puzzle');
let cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => console.log('Hello, world!'));

app.use('/api/puzzle', puzzle);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Listening on port ${port}`));
