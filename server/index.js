const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 8000;

const pool = new Pool({
    user: 'saim',
    host: 'localhost',
    database: 'twilio-hackathon',
    password: 'postgres',
    port: 5432,
});

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, 
    },
});

app.get('/product', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM product');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server error');
    }
});

app.put('/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await pool.query(
            'UPDATE product SET available = false WHERE id = $1 RETURNING *',
            [productId]
        );

        if (result.rowCount > 0) {
            const product = result.rows[0];

            io.emit('productSold', { product });

            res.status(200).json({ message: 'Product availability updated', product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
