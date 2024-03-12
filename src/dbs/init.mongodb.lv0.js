"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017";

mongoose
  .connect(connectString)
  .then((_) => console.log("connect success"))
  .catch((err) => console.log("err", err));

module.exports = mongoose;
