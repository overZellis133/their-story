var express  = require("express"),
    User     = require("../models/user"),
    passport = require("passport"),
    OpenTok  = require("opentok"),
    app      = express(),
    router   = express.Router();
    
var apiKey = process.env.TOKBOX_API_KEY,
    apiSecret = process.env.TOKBOX_SECRET;
    
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
});

// Landing Page / Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            email: req.body.email
        });
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message)
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Their Story, " + user.username);
           res.redirect("/stories");
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login", {page: "login"});
});

router.post("/login", function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return next(err);
        } if(!user) {
            req.flash("error", "Username or password is incorrect.");
            return res.redirect("/login");
        }
        req.logIn(user, function(err){
            if(err){return next(err);}
            var redirectTo = req.session.redirectTo ? req.session.redirectTo: "/stories";
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        });
    })(req,res,next);
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out");
   res.redirect("/stories");
});

router.get("/host", function(req, res){
    var sessionId = app.get('sessionId'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('session', {
      apiKey: apiKey, 
      sessionId: sessionId, 
      token: token
  });
});

module.exports = router;