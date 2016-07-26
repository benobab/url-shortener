var express = require("express");
var validurl = require("valid-url");
var MongoClient = require('mongodb').MongoClient;


var app = express();

//Useful functions
function getLinkCollection(){
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err) throw err;
        console.log("Connected to the database bitches");
        db.collection('links',function(err,collection){
            if(err) throw err;
            console.log("collection: "+ collection);
            return collection;
        });
      });
}


function insertLink(link,callback){
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err) throw err;
        console.log("Connected to the database bitches");
        db.collection('links',function(err,collection){
            if(err) throw err;
            console.log("collection: "+ collection);
            collection.insert({"original_link":link},function(err,data){
                if(err) throw err;
                console.log(data);
                callback(JSON.stringify({"original_link":link,"shortened_link":"https://api-projects-backend-benobab.c9users.io/"+data["ops"][0]._id}));
            });
        });
      });
}

function redirectWithId(id,callback){
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err){
            callback(err,null);
        }
        console.log("Connected to the database bitches");
        db.collection('links',function(err,collection){
            if(err){
                callback(err,null);
            }
            console.log("collection: "+ collection);
            collection.find({"_id":id}).toArray(function(err,data){
                console.log(data.length);
                if(err != null || data.length <= 0){
                    callback(err,null);
                }
                callback(null,data[0].original_link);
            });
        });
      });
}


//USEFUL FUNCTION
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//ROUTES
app.get('*',function(req,res){
   var path = req.path.substr(1,req.path.length);
   console.log("GET request on "+path);
   
   if(validurl.isUri(path)){
       console.log("Let's shorten this Uri!");
       insertLink(path,function(data){
          res.end(data);
       });
   }else{
/*       if(isNumeric(path)){*/
        redirectWithId(path,function(err,data){
            if(err){
                console.log(err);
                return;
            }else{
                console.log("redirect to :"+data);
                res.redirect(data);
            }
        });
       /*}*/
       console.log("Let's see if this is a Uri already into the db!");
   }
});


app.listen(8080,function(){
    console.log("App running on 8080!");
});