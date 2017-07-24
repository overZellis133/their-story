var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express(),
    Story                = require("./models/story"),
    Comment              = require("./models/comment"),
    User                 = require("./models/user"),
    seedDB               = require("./seeds");

// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost/their_story"
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
seedDB();

// Landing Page
app.get("/", function(req, res){
    res.render("landing");
});

// RESTful ROUTES

// INDEX ROUTE - show all stories
app.get("/stories", function(req, res){
    // Get all the stories from DB
    Story.find({}, function(err, allStories){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {stories: allStories});
        }
    });
});

// CREATE ROUTE - add new story
app.post("/stories", function(req, res){
   var title = req.body.title;
   var youtubeID = req.body.youtubeID;
   var description = req.body.description;
   var newStory = {
       title: title,
       youtubeID: youtubeID,
       description: description
   };
   
  Story.create(newStory, function(err, newlyCreated){
      if (err) {
          console.log(err);
      } else {
          console.log("CREATED NEW STORY");
          console.log(newlyCreated);
          res.redirect("/stories");
      }
  });
});


// NEW ROUTE - show form to create new story
app.get("/stories/new", function(req, res){
   res.render("new");
});


// SHOW ROUTE - shows more info about one story
app.get("/stories/:id", function(req, res){
    // find story with provided ID
    Story.findById(req.params.id)
        .populate("comments")
            .exec(function(err, foundStory){
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundStory);
                    res.render("show", {story: foundStory});
                }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});