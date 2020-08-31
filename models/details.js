var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
  ticket_id: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  ticket_date: {
    type: String,
    required: true,
  },
  slot: {
    hrs: {
      type: Number,
      required: true,
    },
    mins: {
      type: Number,
      required: true,
    },
  },
  booking_date: {
    type: String,
    required: true,
  },
  ticket_expired: {
    type: Boolean,
  },
})),
  (Details = mongoose.model("Details", userSchema));

module.exports = Details;
