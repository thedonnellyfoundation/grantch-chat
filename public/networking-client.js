var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

var statuss = document.getElementById('status');

var username = document.getElementById('username');
var password = document.getElementById('password');

var nameColor = document.getElementById('name-color');
var messageColor = document.getElementById('message-color');

var show_password = document.getElementById('show-password');

var messageDIV = document.getElementById('messages-div');

$('#input').focus();

window.setInterval(() => {
    if (show_password.checked) {
        password.type = 'text';
    }
    else {
        password.type = 'password';
    }
}, 1000/20);

function login() {
    socket.emit('login', username.value, password.value);
}

$('#login-form').submit(function(e) {
    e.preventDefault();

    socket.emit('login', username.value, password.value);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (input.value) {
    socket.emit('chat message', input.value, username.value, password.value, nameColor.value, messageColor.value);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.innerHTML = msg;
    messages.appendChild(item);
    messageDIV.scrollTop = messageDIV.scrollHeight;
});

socket.on('login succesful', function() {
    statuss.innerHTML = 'Succesfully logged in';
});

socket.on('password wrong', ()=> {
    statuss.innerHTML = 'Password is incorrect';
})

socket.on('created account', ()=> {
    statuss.innerHTML = 'Account has been created';
});

socket.on('authfailedmessage', ()=> {
    window.alert('Message could not be sent, username and password are wrong (get fucked lmao?)');
})

socket.on('oldmessages', (msgs) => {
    for (i = 0; i < msgs.messages.length; i++) {
        var item = document.createElement('li');
        item.innerHTML = msgs.messages[i];
        messages.appendChild(item);
        messageDIV.scrollTop = messageDIV.scrollHeight;
    }
});