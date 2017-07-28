var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Landing Page / Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
   res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/stories",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/stories");
});

// middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;