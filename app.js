var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express();

// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost/their_story"
mongoose.connect(url);

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

// var stories = [
//     // { "title" : "Learning to Ski & A Night in Kentucky", "youtubeID" : "IjFRdBfEj1I", "__v" : 0 }
//     { "title" : "Story Session VI",
//     "youtubeID" : "SUGgKuO6wpM"
//     },
//     { "title" : "Story Session VII", 
//     "youtubeID" : "lefmsKYasxA"
//     },
//     { "title" : "Story Session IX", 
//     "youtubeID" : "IvpvAr7bUBM"
//     },
//     { "title" : "Story Session IIX", 
//     "youtubeID" : "ayZaTx01Puc"
//     },
//     { "title" : "On Fear", 
//     "youtubeID" : "uUlppt-q7XE"
//     },
//     { "title" : "On Education", 
//     "youtubeID" : "Vj6P46h-l44"
//     },
//     { "title" : "Proudest Moments", 
//     "youtubeID" : "MPBsgvMGE-Q"
//     },
//     { "title" : "What People Would Be Surprised to Know About Mom", 
//     "youtubeID" : "CS84dCI20ME"
//     },
//     { "title" : "What Would Surprise People About Dad", 
//     "youtubeID" : "g-qLbTsNAiA",
//     "description": "This is a description"
//     }
// ];

// Story.create(
//     stories,
//     function(err, story) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("CREATED NEW STORY");
//             console.log(story);
//         }
//     }
// );

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
   var newStory = {
       title: title,
       youtubeID: youtubeID
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
    Story.findById(req.params.id, function(err, foundStory){
        if (err) {
            console.log(err);
        } else {
            res.render("show", {story: foundStory});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});