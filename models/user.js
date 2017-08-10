var mongoose = require("mongoose");
// var mongooseTypeEmail = require("mongoose-type-email");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
   username: String,
   email: 
      {
         type: String,
         unique: true
      },
   password: String,
   stories: [
       {
           type: mongoose.Schema.Types.ObjectId, 
           ref: "Story"
       }
   ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);