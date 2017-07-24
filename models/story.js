var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
   title: String,
   youtubeID: String,
   description: String,
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
   ]
});

module.exports = mongoose.model("Story", storySchema);