var express = require('express');
var app     = express();
var maxAge  = 31557600000;

var news = [
	{ id: 0, author: 'Bruno', category: 'Troll', content: "I hate Javascript!", likes: 8 },
	{ id: 1, author: 'Pierre', category: 'Hope', content: "My survey application will be used... I hope.", likes: 0 },
	{ id: 2, author: 'Pierre', category: 'True fact', content: "Angular training is bullsh**.", likes: 1200 }
];

var getNewsIndex = function(pId) {
	for (var index = 0; index < news.length; index++) {
		var n = news[index];
		if (n.id == pId) {
			return index;
		}
	}
	return -1;
};

var getNews = function(pId) {
	var index = getNewsIndex(pId);
	return index > -1 ? news[index] : null;
};

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/app' ));

app.get('/', function(req,res)
{
    res.sendfile(__dirname + '/app/index.html');
});

app.get('/news', function(req, res) {
	res.json(news);
});

app.get('/news/random', function(req, res) {
	var id = Math.floor(Math.random() * quotes.length);
	var n = news[id];
	res.json(n);
});

app.get('/news/:id', function(req, res) {
	if(news.length <= req.params.id || req.params.id < 0) {
		res.statusCode = 404;
		return res.send('Error 404: No quote found');
	}

	var n = getNews(req.params.id);
	res.json(n);
});

app.post('/news', function(req, res) {
	if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('content')
			|| !req.body.hasOwnProperty('category')|| !req.body.hasOwnProperty('id')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}
	
	var idNews = req.body.id;
	
	/*for (var key in req.body) {
		console.log(key + "=>" + req.body[key]);
	}*/
	
	if (idNews == -1) {
		var newNews = {
				id: news.length,
				author : req.body.author,
				category : req.body.category,
				content : req.body.content,
				likes : 0
			};
		news.push(newNews);
		
		res.json(newNews);
	} else {
		var updatedNews = getNews(req.body.id);
		updatedNews.likes = req.body.likes;
		
		res.json(updatedNews);
	}
});

app.delete('/news', function(req, res) {
	news.splice(getNewsIndex(req.body.id), 1);
	res.json(true);
});

app.listen(3000);

console.log('Listening on port 3000');

