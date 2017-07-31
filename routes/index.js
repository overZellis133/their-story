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
   res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
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

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/stories",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/stories");
});

module.exports = router;