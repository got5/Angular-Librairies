var express = require('express');
var fs = require("fs");
var app = express();
var maxAge = 31557600000;

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function loadFile(file) {

    var filePath = __dirname + "/app/" + file;
    return readJsonFileSync(filePath);
}

var news = loadFile('data/news.json');
var catalog = loadFile('data/catalog.json');
var users = loadFile('data/users.json');


var getIndexFromCol = function (col, pId) {
    for (var index = 0; index < col.length; index++) {
        var n = col[index];
        if (n.id == pId) {
            return index;
        }
    }
    return -1;
};

var auth = function (login) {
    for (var index = 0; index < users.length; index++) {
        var user = users[index];
        if (user.login == login) {
            return user;
        } else {
            return false;
        }
    }
};

var getFromCol = function (col, pId) {
    var index = getIndexFromCol(col, pId);
    return index > -1 ? col[index] : null;
};


app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/app'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/index.html');
});

app.post('/api/login', function (req, res) {

    if (!req.body.hasOwnProperty('login') || !req.body.hasOwnProperty('password')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    } else {
        var login = req.body.login;
        var password = req.body.password;
        var user = auth(login);
        if (user.password === password) {
            user.token = guid();
            return res.send(user);
        } else {
            res.statusCode = 403;
            return res.send('Error 403: Not allowed.');
        }
    }

});

/*______________________*/

app.get('/api/news', function (req, res) {
    res.json(news);
});

app.get('/api/news/random', function (req, res) {
    var id = Math.floor(Math.random() * news.length);
    var n = news[id];
    res.json(n);
});

app.get('/api/news/:id', function (req, res) {
    if (news.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No quote found');
    }

    var n = getFromCol(news, req.params.id);
    res.json(n);
});

app.post('/api/news', function (req, res) {
    if (!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('content')
        || !req.body.hasOwnProperty('category')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var newNews = {
        id: news.length,
        author: req.body.author,
        category: req.body.category,
        content: req.body.content,
        likes: 0
    };
    news.push(newNews);

    res.json(newNews);

});

app.get('/api/news/like/:id', function (req, res) {

    var idNews = req.params.id;

    var updatedNews = getFromCol(news, idNews);
    if (!updatedNews) {
        res.statusCode = 400;
        return res.send('Error 400: News not found');
    }
    updatedNews.likes += 1;

    res.json(updatedNews);

});


app.delete('/api/news/:id', function (req, res) {
    var index = getIndexFromCol(news, req.params.id);
    news.splice(index, 1);
    res.json(true);
});


app.get('/api/catalog', function (req, res) {
    res.json(catalog);
});

app.get('/api/catalog/:id', function (req, res) {
    if (catalog.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No quote found');
    }

    var n = getFromCol(catalog, req.params.id);
    res.json(n);
});

app.listen(3000);

console.log('Listening on port 3000');

