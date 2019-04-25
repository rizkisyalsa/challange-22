var express = require('express');
var router = express.Router();
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");

    const page = req.query.page || 1
    const limit = 5
    const skip = (page - 1) * limit
    let obj = {}


    if (req.query.id3 && req.query.id) {
      obj._id = parseInt(req.query.id)
    }
    if (req.query.string3 && req.query.string) {
      obj.string = req.query.string
    }
    if (req.query.integer3 && req.query.integer) {
      obj.integer = req.query.integer
    }
    if (req.query.float3 && req.query.float) {
      obj.float = req.query.float
    }
    if (req.query.date3 && req.query.date && req.query.date1) {
      let tgl = {
        $gte: req.query.date,
        $lte: req.query.date1
      }
      obj.date = tgl
    }
    if (req.query.boolean3 && req.query.boolean) {
      obj.boolean = req.query.boolean
    }

    // console.log(typeof obj);
    // console.log(obj);
    db.collection("crud").find(obj).count(function (err, count) {
      db.collection("crud").find(obj).limit(limit).skip(skip).sort({ _id: 1 }).toArray(function (err, docs) {
        const pages = Math.ceil(count / limit)
        console.log(count);
        res.render('list', {
          data: docs,
          moment,
          query: req.query,
          pagination: {
            page, count, pages
          },
        })
      });
    });
  });
})


router.get('/add', function (req, res, next) {
  res.render('add', {
    title: "Add Data",
    query: req.query
  })
})

router.post('/add', function (req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("crud").insertMany([
      { _id: Math.floor(Math.random() * 500), string: req.body.string2, integer: req.body.integer2, float: req.body.float2, date: req.body.date2, boolean: req.body.boolean2 }
    ])
    res.redirect('/')
  });
});

router.get('/delete/:id', function (req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("crud").deleteOne({ _id: parseInt(req.params.id) })
    res.redirect('/')
  });
});

router.get('/edit/:id', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("crud").find({ _id: parseInt(req.params.id) }).toArray(function (err, docs) {
      let item = docs[0]
      res.render('edit', {
        item,
        moment,
        query: req.query
      });
    });
  });
});

router.post('/edit/:id', function (req, res, next) {
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("crud").updateOne({ _id: parseInt(req.params.id) }
      , { $set: { string: req.body.string, integer: req.body.integer, float: req.body.float, date: req.body.date, boolean: req.body.boolean } })
    res.redirect('/')
  });
});



module.exports = router;





