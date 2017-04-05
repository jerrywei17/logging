const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser'); //解析請求
const session = require('express-session')
const dbUrl = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost/chatroom';

mongoose.connect(dbUrl);

app.set('views', './app/views/pages')
app.set('view engine', 'pug');
//解析JSON格式
app.use(bodyParser.json());
//解析表單
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'jerrywei',
    resave: false,
    saveUninitialized: false
}));


app.use(express.static(__dirname + '/public'));

require('./config/routes')(app);

io.on('connection', function(socket) {
    socket.on('addme', function(username) {
        socket.username = username;
        socket.emit('chat', 'SERVER', '你已加入聊天室...');
        socket.broadcast.emit('chat', 'SERVER', username + ' 進入聊天室...');
    });
    socket.on('sendchat', function(data) {
        io.sockets.emit('chat', socket.username, data);
    });

    socket.on('disconnect', function() {
        io.sockets.emit('chat', 'SERVER', socket.username + ' 離開聊天室...');
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});