var express = require("express");
var router = express.Router();
var Story = require("../models/story");
var middleware = require("../middleware");

// INDEX ROUTE - show all stories
router.get("/", function(req, res){
    // Get all the stories from DB
    Story.find({}, function(err, allStories){
        if (err) {
            console.log(err);
        } else {
            res.render("stories/index", {stories: allStories, page: "stories"});
        }
    });
});

// CREATE ROUTE - add new story
router.post("/", middleware.isLoggedIn, function(req, res){
   var title = req.body.title;
   var youtubeID = req.body.youtubeID;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newStory = {
       title: title,
       youtubeID: youtubeID,
       description: description,
       author: author
   };
   
  Story.create(newStory, function(err, newlyCreated){
      if (err) {
          console.log(err);
      } else {
          console.log(newlyCreated);
          req.flash("success", "Added story");
          res.redirect("/stories");
      }
  });
});


// NEW ROUTE - show form to create new story
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("stories/new");
});


// SHOW ROUTE - shows more info about one story
router.get("/:id", function(req, res){
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

// EDIT STORY ROUTE
router.get("/:id/edit", middleware.checkStoryOwnership, function(req, res){
    Story.findById(req.params.id, function(err, foundStory){
       if (err) {
           console.log(err);
       } else {
           res.render("stories/edit", {story: foundStory});
       }
    });
});


// UPDATE STORY ROUTE
router.put("/:id", middleware.checkStoryOwnership, function(req, res){
    // find and update correct story
    Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updatedStory){
       if (err) {
           console.log(err);
           res.redirect("/stories");
       } else {
           // redirect to show page
           res.redirect("/stories/" + req.params.id);
       }
    });
});

// DESTROY STORY ROUTE
router.delete("/:id", middleware.checkStoryOwnership, function(req, res){
   Story.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/stories");
       } else {
           req.flash("success", "Story deleted");
           res.redirect("/stories");
       }
   });
});

module.exports = router;