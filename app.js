var methodOverride       = require("method-override"),
    bodyParser           = require("body-parser"),
    mongoose             = require("mongoose"),
    express              = require("express"),
    app                  = express(),
    flash                = require("connect-flash"),
    passport             = require("passport"),
    LocalStrategy        = require("passport-local"),
    Story                = require("./models/story"),
    Comment              = require("./models/comment"),
    User                 = require("./models/user"),
    seedDB               = require("./seeds");
    
// requiring routes
var commentRoutes = require("./routes/comments"),
    storyRoutes   = require("./routes/stories"),
    indexRoutes   = require("./routes/index");

// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost/their_story"
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/stories", storyRoutes);
app.use("/stories/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Their Story app has started");
});