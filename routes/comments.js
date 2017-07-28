var express = require("express");
var router = express.Router({mergeParams: true});
var Story = require("../models/story");
var Comment = require("../models/comment");

// COMMENTS NEW
router.get("/new", isLoggedIn, function(req, res){
    // find story by id
    Story.findById(req.params.id, function(err, story){
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {story: story});
       }
    });
});

// COMMENTS CREATE
router.post("/", isLoggedIn, function(req, res){
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
                //   add username & id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save();
                story.comments.push(comment);
                story.save();
                console.log(comment);
                res.redirect("/stories/" + req.params.id);
              }
           });
       }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;