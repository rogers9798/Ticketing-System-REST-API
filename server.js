var express = require("express");
var app = express();
var path = require("path");

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

var port = 3000;
app.listen(port, function () {
  console.log("Express app listening on port ", port);
});
