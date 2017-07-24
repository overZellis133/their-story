var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
   email: String,
   name: String,
   stories: [
       {
           type: mongoose.Schema.Types.ObjectId, 
           ref: "Story"
       }
   ]
});

module.exports = mongoose.model("User", userSchema);