var express = require("express");
var router = express.Router();

var Details = require("../models/details");

//endpoint to post details or book a new ticket
router.post("/", function (req, res, next) {
  var ticket_info = req.body;
  ticket_info.ticket_id =
    req.body.username + req.body.phone.toString().substring(0, 4);
  ticket_info.timings = new Date();

  // if ((new Date("2020-08-29 20:49") - ticket_info.timings)) {
  //     ticket_info.ticket_expired = true;
  // }
  // console.log(new Date("2020-08-29 20:49") - ticket_info.timings);

  var newticket = new Details({
    ticket_id: ticket_info.ticket_id,
    username: ticket_info.username,
    phone: ticket_info.phone,
    timings: ticket_info.timings,
    ticket_expired: ticket_info.ticket_expired,
  });
  console.log("Ticket Data : \n");
  console.log(newticket);

  newticket.save(function (err, ticket) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
    }
  });

  res.json(ticket_info);
});

//endpoint to delete a ticket using ticket_id
router.delete("/delete/:tid", async (req, res) => {
  const del_ticket = await Details.find({ ticket_id: req.params.tid });

  if (Object.keys(del_ticket).length === 0) {
    res.status(404).json({
      message: "wrong ID passed...ticket does not exists",
    });
  } else {
    const del_details = await Details.deleteOne({ ticket_id: req.params.tid });
    res.status(200).json({
      message: "handling delete request from /:tid",
      details: del_ticket,
      delete_response: del_details,
    });
  }
});

//endpoint to retrieve details for the given ticket_id
router.get("/:tid", async (req, res) => {
  const data = await Details.find({ ticket_id: req.params.tid });
  if (Object.keys(data).length === 0) {
    res.status(404).json({
      message: "wrong ID passed...ticket does not exists",
    });
  } else {
    const del_details = await Details.deleteOne({ ticket_id: req.params.tid });
    res.status(200).json({
      message: "handling get request from /:tid",
      details: data,
    });
  }
});

module.exports = router;
