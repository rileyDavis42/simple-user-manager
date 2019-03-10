const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const path = require('path');

const port = process.env.port || 9999;

let users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let successMessage = '';

app.get('/', (req, res) => {
    res.render('index', {
        users: users,
        successMessage: successMessage
    });
    successMessage = '';
});

app.get('/addUser', (req, res) => {
    res.render('adduser');
});

app.get('/*.css/', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles', req.url));
});

app.get('/*.js/', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', req.url));
});

app.post('/addUser', (req, res) => {
    users.push({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    });
    res.redirect('/');
});

app.post('/deleteUser', (req, res) => {
    let newUsers = [];
    let username = req.body.username;
    for (let i = 0; i < users.length; i++) {
        if(users[i].username !== username) {
            newUsers.push(users[i]);
        }
    }
    users = newUsers;
    res.redirect('/');
});

app.post('/editUser', (req, res) => {
    let username = req.body.username;
    let user = {};
    for(let i = 0; i < users.length; i++) {
        if(users[i].username === username) {
            user = users[i];
        }
    }
    res.render('editUser', {
        user: user
    });
});

app.post('/edit', (req, res) => {
    let newUser = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    };
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.body['userid']) {
            users[i] = newUser;
        }
    }
    successMessage = 'Changes have been saved...';
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
