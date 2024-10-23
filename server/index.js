
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 8000;

const supabaseUrl = 'https://kczixjvsrjkyymolhiyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjeml4anZzcmpreXltb2xoaXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MDc0NTgsImV4cCI6MjA0NTI4MzQ1OH0.7bHPoLbVUFlIT61LZhyoOsYt3efOadZefieAAN0_vZc';
const supabase = createClient(supabaseUrl, supabaseKey);

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
};

app.use(cors(corsOptions));

const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         credentials: true
//     },
//     path: '/socket.io'
// });

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    path: '/socket.io'
});



// Twilio configuration
const twilioAccountSid = 'ACbd59d86a65f56470e43fd2fef2c846a3';
const twilioAuthToken = 'fcd7bb9f2d81ec428a483f214fb48b6d';
const twilioPhoneNumber = '+447883305429';

const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

app.get('/product', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*');

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server error');
    }
});

app.put('/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const { data, error } = await supabase
            .from('product') 
            .update({ available: false }) 
            .eq('id', productId)
            .select('*');
        if (error) {
            throw error;
        }

        if (data.length > 0) {
            const product = data[0];

            io.emit('productSold', { product });

            const message = await twilioClient.messages.create({
                body: `Product "${product.name}" has been sold!`,
                from: twilioPhoneNumber,
                to: '+447926701510', 
            });

            console.log('Message sent: ', message.sid);

            res.status(200).json({ message: 'Product availability updated', product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports = app;