// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
  if(err) throw err;
  console.log("Connected to the database bitches");
  
  //Create collection
  db.createCollection('links',function(err,collection){
    if (err) throw err;
    console.log("Collection created \n" + collection);
  });
});