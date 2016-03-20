var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use("/", express.static(__dirname));


app.use(express.static('./public'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
        response.send(cool());

});

app.get('/lab8', function(request, response) {
        console.log("lab8");
        response.render('../public/lab8');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


