var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/their_story");
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
            res.render("stories", {stories: allStories});
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});