const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const exampleRoutes = require("./routes/examples");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

mongoose.Promise = Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
var mongooseOptions = { useNewUrlParser: true };

mongoose
  .connect("mongodb+srv://patty:Patty1234.@cluster0.vprjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", mongooseOptions)
  .then(() => {
    console.log("connection Successful!");
  })
  .catch(err => {
    console.log("connection failed!" + err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/example", exampleRoutes);

module.exports = app;