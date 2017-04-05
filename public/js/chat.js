"use strict";
$(function() {
    var socket = io();
    socket.on('connect', function() {
        socket.emit('addme', $('#username').val());
    });

    socket.on('chat', function(username, data) {
        $('#messages').append($('<li>').html('<span class="name">' + username + ' :</span> ' + data));
        var msgBox = document.getElementById('msgBox');
        console.log(msgBox.scrollHeight);
        msgBox.scrollTop = msgBox.scrollHeight;
    });

    $('#msgSubmitBtn').click(function() {
        socket.emit('sendchat', $('#msgInput').val());
        $('#msgInput').val('');
        return false;
    });

    $("#msgInput").keydown(function(event) {
        if (event.which == 13) {
            $('#msgSubmitBtn').click();
        }
    });
});