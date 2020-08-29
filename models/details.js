var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
  ticket_id: Number,
  username: String,
  phone: Number,
  timings: {
    type: Date,
    default: Date.now(),
  },
  ticket_expired: Boolean,
})),
  (User = mongoose.model("Details", userSchema));

module.exports = Details;
