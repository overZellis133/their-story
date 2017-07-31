var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
   title: String,
   youtubeID: String,
   description: String,
   createdAt: 
      {
         type: Date,
         default: Date.now
      },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
   ],
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Story", storySchema);