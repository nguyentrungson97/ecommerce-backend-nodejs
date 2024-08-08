const app = require("./src/app");
const config = require("./src/configs/configs");

const server = app.listen(config.app.port, () => {
  console.log("Server start with " + config.app.port);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
