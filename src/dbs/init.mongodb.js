"use strict";
const {
  db: { host, port, name },
} = require("../configs/configs");
const mongoose = require("mongoose");

const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnections } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: "true" });

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => {
        console.log("Connect success");
        countConnections();
      })
      .catch((err) => console.log("err", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
