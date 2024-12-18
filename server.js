const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Menyimpan jumlah suara setiap kandidat
let votes = {
    'Candidate A': 0,
    'Candidate B': 0,
    'Candidate C': 0
};

// Sajikan file statis dari folder "public"
app.use(express.static('public'));

// Tambahkan rute untuk "/result" untuk menyajikan file result.html
app.get('/result', (req, res) => {
    res.sendFile(__dirname + '/public/result.html');
});

// Event Socket.io
io.on('connection', (socket) => {
    console.log('Pengguna terhubung');

    // Kirim data voting saat pertama kali pengguna terhubung
    socket.emit('updateVotes', votes);

    // Menerima event "vote" dari client
    socket.on('vote', (candidate) => {
        if (votes[candidate] !== undefined) {
            votes[candidate]++;
            io.emit('updateVotes', votes);
            console.log(`Vote diterima untuk ${candidate}: Total = ${votes[candidate]}`);
        }
    });
});

// Jalankan server di port 3000
server.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
