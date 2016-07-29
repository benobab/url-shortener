var express = require("express");
var validurl = require("valid-url");
var MongoClient = require('mongodb').MongoClient;


var app = express();
insertLink("http://www.facebook.com",function(){
    /*getAllLinks();*/
});
getLinkById("57979c44cbbd23c6d4433611");
//Useful functions

function getAllLinks(){
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err) throw err;
        console.log("Connected to the database");
        db.collection('links',function(err,collection){
            if(err) throw err;
            console.log("collection: "+ collection);
            collection.find().toArray(function(err,data){
               if(err) throw err;
               console.log(JSON.stringify(data));
               db.close();
            });
        });
      });
}

function getLinkById(id){
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err) throw err;
        console.log("Connected to the database");
        db.collection('links',function(err,collection){
            if(err) throw err;
            console.log("collection: "+ collection);
            collection.find({"id":Number(id)}).toArray(function(err,data){
               if(err) throw err;
               console.log(JSON.stringify(data));
               db.close();
            });
        });
      });
}

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
            //Find new ID
            collection.count(function(err,count){
                if (err) throw err;
                collection.insert({"original_link":link,"id":Number(count + 1)},function(err,data){
                if(err) throw err;
                console.log(data + "\n inserted");
                callback(JSON.stringify({"original_link":link,"shortened_link":"https://api-projects-backend-benobab.c9users.io/"+String(Number(count + 1))}));
            });
            })
            
        });
      });
}

function redirectWithId(id,callback){
    MongoClient.connect("mongodb://localhost:27017/url-shortener-db", function(err, db) {
        if(err){
            callback("error",null);
            return;
        }
        console.log("Connected to the database bitches");
        db.collection('links',function(err,collection){
            if(err){
                callback("error",null);
                return;
            }
            console.log("collection: "+ collection);
            collection.find({"id":Number(id)}).toArray(function(err,data){
                console.log(data.length);
                if(err != null || data.length <= 0){
                    callback("error",null);
                    return;
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
       if(isNumeric(path)){
        redirectWithId(path,function(err,data){
            if(err){
                endWithError(res);
            }else{
                console.log("redirect to :"+data);
                res.redirect(data);
            }
        });
       }else{
           endWithError(res);
       }
   }
});

function endWithError(res){
    res.end(JSON.stringify({"error":"Please enter a valid id or a valid URL"}));
}
app.listen(8080,function(){
    console.log("App running on 8080!");
});