const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;
const countConnections = () => {
  console.log("Number of connections::" + mongoose.connections.length);
};

const checkOverload = () => {
  setInterval(
    () => {
      const connections = mongoose.connections.length;
      const numberCores = os.cpus().length;
      const memoryUsage = process.memoryUsage().rss;

      //ex: 1 core handle 5 connections
      const maxConnections = numberCores * 5;
      console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`);

      if (connections >= maxConnections) {
        console.log("Warning: Overload server!!!");
      }
    },

    _SECOND // check 5s in times
  );
};
module.exports = {
  countConnections,
  checkOverload,
};
