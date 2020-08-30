var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
  ticket_id: String,
  username: String,
  phone: Number,
  timings: {
    type: Date,
    default: Date.now()
  },
  ticket_expired: Boolean,
})),
  (Details = mongoose.model("Details", userSchema));

module.exports = Details;
