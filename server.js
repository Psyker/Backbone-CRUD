var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/backbonetuto');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
  author: String,
  title: String,
  release: Number
});

mongoose.model('Book', BookSchema);

var Book = mongoose.model('Book');

/**var book = new Book({
  author: 'Theo',
  title: 'The Book of Destiny',
  release: 2016
})

book.save();*/

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// ROUTES

app.get('/api/books', function(req, res){
  Book.find(function(err, docs) {
    docs.forEach(function(item){
      console.log('Received a GET request for _id: '+ item._id)
    });
    res.send(docs);
  });
});

app.post('/api/books', function(req, res) {
  console.log('Received a POST request.');
  for (var key in req.body) {
    console.log(key + ': '+ req.body[key])
  }
  var book = new Book(req.body);
  book.save(function(err, doc) {
      res.send(doc);
  });
});

var port = 3000;

app.listen(port);
console.log('Server on ' + port)
