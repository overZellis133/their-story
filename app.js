var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express(),
    passport             = require("passport"),
    LocalStrategy        = require("passport-local"),
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
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Any direction you choose...",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

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
            res.render("stories/index", {stories: allStories});
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
   res.render("stories/new");
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
                    res.render("stories/show", {story: foundStory});
                }
    });
});

// =============
// COMMENTS ROUTES
// =============

app.get("/stories/:id/comments/new", isLoggedIn, function(req, res){
    // find story by id
    Story.findById(req.params.id, function(err, story){
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {story: story});
       }
    });
});

app.post("/stories/:id/comments", isLoggedIn, function(req, res){
    // find story by id
    Story.findById(req.params.id, function(err, story){
       if (err) {
           console.log(err);
           res.redirect("/stories");
       } else {
           // create new comment
           Comment.create(req.body.comment, function(err, comment){
              if (err) {
                  console.log(err);
              } else {
                  story.comments.push(comment);
                  story.save();
                  res.redirect("/stories/" + req.params.id);
              }
           });
       }
    });
});

// ===========
// AUTH ROUTES
// ===========

// SHOW REGISTER FORM
app.get("/register", function(req, res){
   res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/stories");
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/stories",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/stories");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});