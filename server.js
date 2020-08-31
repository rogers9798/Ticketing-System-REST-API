var express = require("express");
var app = express();
var path = require("path");
const cron = require('node-cron');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./models/details");

mongoose.connect("mongodb://localhost/ticket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var indexf = require("./routes/index.js");
app.use("/", indexf);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

//cron job scheduled for every minute to check for expired ticket and delete it
cron.schedule("* * * * *", async (req, res) => {
  console.log("running a task every minute");

  const curr_date = new Date();
  const h = parseInt(curr_date.getHours());
  var date = curr_date.getDate();
  var month = curr_date.getMonth();
  var year = curr_date.getFullYear();

  dateString =
    "0" +
    (month + 1).toString() +
    "/" +
    date.toString() +
    "/" +
    year.toString();

  console.log(dateString);
  console.log(dateString.substring(3, 5) - "30");

  var check = await Details.aggregate([
    {
      $project: {
        "slot.hrs": {
          $lte: ["$slot.hrs", { $abs: { $subtract: [h, 8] } }],
        },
      },
    },
  ]);

  console.log(check);
  check.forEach(async (obj) => {
    if (obj.slot.hrs == true) {
      await Details.updateOne(
        { _id: obj._id },
        { $set: { ticket_expired: true } }
      );
    }
  });

  const dataN = await Details.find({ ticket_expired: true });
  const rmv = await Details.deleteMany({ ticket_expired: true });

  if (dataN.length === 0) {
    console.log("No ticket is expired\n")
  } else {
    console.log(dataN);
    console.log(rmv);
    console.log("\nDetails for expired ticket have been updated and expired tickets have been removed",
      dataN,
      rmv)
  }
})


var port = 3000;
app.listen(port, async () =>{
  console.log("Express app listening on port ", port);
});
