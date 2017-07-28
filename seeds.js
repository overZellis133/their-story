var mongoose = require("mongoose");
var Story = require("./models/story");
var Comment = require("./models/comment");

var stories = [
    { 
        "title" : "Learning to Ski & A Night in Kentucky", 
        "youtubeID" : "IjFRdBfEj1I",
        "description": "This is a description"
    },
    { 
        "title" : "Story Session VI",
        "youtubeID" : "SUGgKuO6wpM",
        "description": "This is a description"
    },
    { 
        "title" : "Story Session VII", 
        "youtubeID" : "lefmsKYasxA",
        "description": "This is a description"
    },
    { 
        "title" : "Story Session IX", 
        "youtubeID" : "IvpvAr7bUBM",
        "description": "This is a description"
    },
    { 
        "title" : "Story Session IIX", 
        "youtubeID" : "ayZaTx01Puc",
        "description": "This is a description"
    },
    { 
        "title" : "On Fear", 
        "youtubeID" : "uUlppt-q7XE",
        "description": "This is a description"
    },
    { 
        "title" : "On Education", 
        "youtubeID" : "Vj6P46h-l44",
        "description": "This is a description"
    },
    { 
        "title" : "Proudest Moments", 
        "youtubeID" : "MPBsgvMGE-Q",
        "description": "This is a description"
    },
    { 
        "title" : "What People Would Be Surprised to Know About Mom", 
        "youtubeID" : "CS84dCI20ME",
        "description": "This is a description"
    },
    { 
        "title" : "What Would Surprise People About Dad", 
        "youtubeID" : "g-qLbTsNAiA",
        "description": "This is a description"
    }
];

function seedDB(){
    Story.remove({}, function(err){
      if (err) {
          console.log(err);
      }
      console.log("REMOVED STORIES!");
    });
    // add a some stories
    stories.forEach(function(seed){
        Story.create(seed, function(err, story){
          if (err) {
              console.log(err);
          } else {
              console.log("ADDED A STORY");
              Comment.create(
                  {
                      text: "This is a comment",
                      author: "Homer"
                  }, function(err, comment){
                      if (err) {
                          console.log(err);
                      } else {
                          story.comments.push(comment);
                          story.save();
                          console.log("Created new comment");
                      }
                  });
          }
        });
    });
    // add some comments
}

module.exports = seedDB;