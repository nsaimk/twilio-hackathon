const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 8000;

const pool = new Pool({
    user: 'saim',
    host: 'localhost',
    database: 'twilio-hackathon',
    password: 'postgres',
    port: 5432,
});

app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM product WHERE id = $1', [productId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error querying the product table', err);
        res.status(500).send('Database error');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
