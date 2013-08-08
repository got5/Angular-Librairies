var express = require('express');
var app     = express();
var maxAge  = 31557600000;

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/www' ));

app.get('/*', function(req,res)
{
    res.sendfile(__dirname + '/www/index.html');
});

app.listen(3005);

console.log('Listening on port 3005');
