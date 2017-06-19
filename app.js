var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/stories", function(req, res){
   res.render("stories") ;
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});