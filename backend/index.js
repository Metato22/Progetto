const express = require('express');
const app = express();
const PORT = 3004;

app.get('/', (req, res) => {
    res.send('Hello from backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});