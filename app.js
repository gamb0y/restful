//jshint esversion: 6

const bodyparser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

const url = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

////////////////////////////// Requests Targetting All Articles /////////////////////////////

app.route('/articles')

.get(function(req, res) {
  Article.find({}, function(err, articles) {
    if (!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  if ( Object.keys(req.body).length === 0 ) {
    res.send('No data received.');
  } else {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send('Successfuly added a new article.');
      } else {
        res.send(err);
      }
    });

  }
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send('Successfuly deleted all the articles.');
    } else {
      res.send(err);
    }
  });
})
;

////////////////////////////// Requests Targetting A Specific Article /////////////////////////////

app.route('/articles/:articleTitle')

.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, article) {
    if (!err) {
      res.send(article);
    } else {
      res.send(err);
    }
  });
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err) {
      if (!err) {
        res.send('Successfuly updated an article.');
      } else {
        res.send('err');
      }
    });
})

.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send('Successfuly updated an article.');
      } else {
        res.send('err');
      }
    });
})

.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle}, 
    function(err) {
      if (!err) {
        res.send('Successfuly deleted an article.')
      } else {
        res.send(err);
      }
    })
})
;



app.listen(3000, function() {
  console.log('Server started on localhost:3000');
});
