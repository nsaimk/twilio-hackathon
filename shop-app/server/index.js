const express = require('express');
const app = express();
const PORT = 8001;

app.get('/', (req, res) => {
    res.send('Hello from your Shops Node.js server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
