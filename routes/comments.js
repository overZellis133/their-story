var express = require("express");
var router = express.Router({mergeParams: true});
var Story = require("../models/story");
var Comment = require("../models/comment");

// COMMENTS NEW
// the full route is /stories/:id/comments/new
// express.Router({mergeParams: true}) passes parameters from stories down to comments
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

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           Comment.findById(req.params.comment_id, function(err, foundComment){
              if (err) {
                  console.log(err);
                  res.redirect("back");
              } else {
                  res.render("comments/edit", {comment: foundComment, story: foundStory});
              }
            });
       }
    });
});


// UPDATE COMMENT ROUTE
router.put("/:comment_id", function(req, res){
    // find and update correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if (err) {
          console.log(err);
          res.redirect("/stories/" + req.params.id);
      } else {
          // redirect to show page
          res.redirect("/stories/" + req.params.id);
      }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if (err) {
          res.redirect("/stories/" + req.params.id);
      } else {
          res.redirect("/stories/" + req.params.id);
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

function checkStoryOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;