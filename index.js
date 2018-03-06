var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/builds/development'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/builds/production'));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function() {
	console.log('App running at http://localhost:' + port);
});