var express = require("express");
var router = express.Router();

var Details = require("../models/details");

//endpoint to post details or book a new ticket
router.post("/", async (req, res, next) => {
  var ticket_info = req.body;
  ticket_info.ticket_id =
    req.body.username + req.body.phone.toString().substring(0, 4);

  var check = await Details.find({ ticket_id: ticket_info.ticket_id });

  var check_num = await Details.countDocuments({
    ticket_date: ticket_info.ticket_date,
    slot: ticket_info.slot,
  });

  if (Object.keys(check).length === 0 && check_num <= 20) {
    var newticket = new Details({
      ticket_id: ticket_info.ticket_id,
      username: ticket_info.username,
      phone: ticket_info.phone,
      ticket_date: ticket_info.ticket_date,
      slot: ticket_info.slot,
      booking_date: ticket_info.booking_date,
      ticket_expired: ticket_info.ticket_expired,
    });
    console.log("Ticket Data : \n");
    console.log(newticket);

    await newticket.save(function (err, ticket) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success...Data entered");
        res.status(200).json({
          message: "Success...Data entered",
          details: ticket_info,
        });
      }
    });
  } else {
    res.status(409).json({
      message:
        "Record for the given username and phone number already exists or max limit for time slots reached",
      details: check,
    });
  }
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
    const data = await Details.find({ ticket_id: req.params.tid });
    res.status(200).json({
      message: "handling get request from /:tid",
      details: data,
    });
  }
});

router.patch("/check_expired", async (req, res) => {
  const curr_date = new Date();
  const t = parseInt(curr_date.getHours());
  console.log(t);
  var check = await Details.updateOne(
    ({
      "slot.hrs": {
        $lte: { $subtract: [t, 8] },
      },
    },
    { ticket_expired: true })
  );

  if (check.nModified === 0) {
    res.status(404).json({
      message: "No ticket is expired",
    });
  } else {
    const dataN = await Details.find({ ticket_expired: true });
    res.status(200).json({
      message: "Details for expired ticket have been updated",
      details: dataN,
    });
  }
  console.log(check);
});

router.patch("/update_timing", async (req, res) => {
  const tid_data = await Details.updateOne(
    { ticket_id: req.body.tid },
    { "slot.hrs": req.body.hrs, "slot.mins": req.body.mins }
  );

  if (tid_data.nModified === 0) {
    res.status(404).json({
      message: "Error",
    });
  } else {
    res.status(200).json({
      message: "Timings for ticket have been updated",
      details: tid_data,
    });
  }
});

router.post("/time", async (req, res) => {
  const data_time = await Details.find({
    ticket_date: req.body.ticket_date,
    "slot.hrs": req.body.hrs,
    "slot.mins": req.body.mins,
  });

  if (Object.keys(data_time).length === 0) {
    res.status(404).json({
      message: "wrong ID passed...ticket does not exists",
    });
  } else {
    res.status(200).json({
      message: "handling get request from /:tid",
      details: data_time,
    });
  }
  console.log(data_time);
});

module.exports = router;
