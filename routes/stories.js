var express = require("express");
var router = express.Router();
var Story = require("../models/story");

// INDEX ROUTE - show all stories
router.get("/", function(req, res){
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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
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

module.exports = router;