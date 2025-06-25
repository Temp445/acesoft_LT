
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Provide name"]
},
email: {
    type: String,
    required: [true, "provide email"],
    unique: true
},
password: {
    type: String,
    required: [true, "provide password"]
},
role: {
  type: String,
  enum: ['ADMIN', "USER"],
  default: "USER"
}

});

module.exports = mongoose.model("Userlist", userSchema);
