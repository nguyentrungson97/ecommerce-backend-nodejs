const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const app = express();
const { checkOverload } = require("./helpers/check.connect");
const morgan = require("morgan");
require("dotenv").config();
// checkOverload();
//init middlewares
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
//  morgan have 5 way:
//  - dev
//  - combined
//  - common
//  - short
//  - tiny

app.use(helmet()); // bảo vệ request, tránh nhận biết công nghệ đang sử dụng
app.use(compression()); // nén request để res nhẹ hơn

//init db
require("./dbs/init.mongodb");

//init routes
app.use("", require("./routes"));
//handles err

module.exports = app;
