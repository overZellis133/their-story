var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express();

// APP CONFIG
// mongoose.connect("mongodb://localhost/their_story");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var storySchema = new mongoose.Schema({
   title: String,
   youtubeID: String,
   description: String
});

var Story = mongoose.model("Story", storySchema);

var stories = [
        {title: "Story Session I", youtubeID: "IjFRdBfEj1I"},
        {title: "Story Session VI", youtubeID: "SUGgKuO6wpM"},
        {title: "Story Session VII", youtubeID: "lefmsKYasxA"},
        {title: "Story Session IIX", youtubeID: "SUGgKuO6wpM"}
    ];

// RESTful ROUTES

// Landing Page
app.get("/", function(req, res){
    
    res.render("landing");
});

// INDEX ROUTE
app.get("/stories", function(req, res){
   res.render("stories", {stories: stories}) ;
});

// CREATE ROUTE
app.post("/stories", function(req, res){
   var title = req.body.title;
   var youtubeID = req.body.youtubeID;
   var newStory = {
       title: title,
       youtubeID: youtubeID
   };
   
   stories.push(newStory);
   res.redirect("/stories");
   
//   Story.create(newStory, function(err, newlyCreated){
//       if(err) {
//           console.log(err);
//       } else {
//           res.redirect("/stories");
//       }
//   });
});


// NEW ROUTE
app.get("/stories/new", function(req, res){
   res.render("new");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});