const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const fs = require('fs');

let rawdata = fs.readFileSync('accounts.json');
let accounts = JSON.parse(rawdata);
rawdata = fs.readFileSync('messages.json');
let messages = JSON.parse(rawdata);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.emit('oldmessages', messages);

    socket.on('login', (username, password) => {
        console.log(`sign in attempt username:${username} password: ${password}`);

        let usernameFound = false;
        let passwordFound = false;

        for (i = 0; i < accounts.accounts.length; i++) {
            console.log(accounts.accounts[i].username);
            if (username == accounts.accounts[i].username) {
                usernameFound = true;

                if (password == accounts.accounts[i].password) {
                    passwordFound = true;

                    socket.emit('login succesful');
                    break;
                }
                else {
                    socket.emit('password wrong');
                }
            }
        }

        if (!usernameFound) {
            accounts.accounts.push({"username" : username, "password" : password});
            socket.emit('created account');

            let data = JSON.stringify(accounts);
            fs.writeFile('accounts.json', data, (err) => {
                if (err) throw err;
        
                console.log('updated accounts.json');
            });
        }
    });

    socket.on('chat message', (msg, username, password, nameColor, messageColor) => {
        console.log('message: ' + msg);

        if (msg == '/clearmessages') {
            messages = {"messages":[]};

            let data = JSON.stringify(messages);
            fs.writeFile('messages.json', data, (err) => {
                if (err) throw err;

                console.log('updated messages.json');
            });
        }
        
        if (authenticateAccount(username, password)) {
            message = `<span style="font-size:30px;color:${nameColor};font-weight:bold;text-shadow: 1px 1px 0px #000;">${username}:</span><span style="font-size:30px;color:${messageColor};"> ${msg}</span>`;

            io.emit('chat message', message, username);
            messages.messages.push(`<span style="font-size:30px;color:${nameColor};font-weight:bold;text-shadow: 1px 1px 0px #000;">${username}:</span><span style="font-size:30px;color:${messageColor};"> ${msg}</span>`);
            
            let data = JSON.stringify(messages);
            fs.writeFile('messages.json', data, (err) => {
                if (err) throw err;

                console.log('updated messages.json');
            });
        }
        else {
            socket.emit('authfailedmessage');
        }
    });

    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });
});

function authenticateAccount(username, password) {
    for (i = 0; i < accounts.accounts.length; i++) {
        if (accounts.accounts[i].username == username) {
            if (accounts.accounts[i].password == password) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    return false;
}

server.listen(80, ()=> {
    console.log('listening on *:80');
});