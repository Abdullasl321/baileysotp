const express = require('express');
const bodyParser = require('body-parser');
const { BaileysClass } = require('@bot-wa/bot-wa-baileys');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});


let sock; // Declare sock at the module level

// Function to establish WhatsApp connection
async function WPconnection() {
    sock = new BaileysClass({});

    sock.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
    sock.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
    sock.on('ready', async () => console.log('READY BOT'));

    sock.on('message', async (message) => {
        console.log("Received message: ", message);
    });
}

// Start WhatsApp connection
WPconnection();

// Endpoint to handle incoming POST requests
app.post('/message', async (req, res) => {
    const { phoneNumber, otp, Smessage } = req.body;

    try {
        if (!sock) {
            throw new Error('WhatsApp connection is not established');
        }

        // Send OTP via WhatsApp
        await sock.sendText(phoneNumber, Smessage);
        res.send('Message received and OTP sent via WhatsApp');
    } catch (error) {
        console.error('Error handling message:', error);
        res.status(500).send('Error handling message');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
