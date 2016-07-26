var express = require("express");

var app = express();

//ToDo: handle request



//Useful functions
function isLinkExisting(link){
    //ToDo
}

function insertLink(link){
    //ToDo
}

function getShortenedLink(link){
    if (isLinkExisting(link)){
        //ToDo:
    }else{
        return insertLink(link);
    }
}

app.listen(8080,function(){
    console.log("App running on 8080!");
});