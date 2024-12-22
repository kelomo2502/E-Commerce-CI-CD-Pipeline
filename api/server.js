const express = require("express");
const port = 5000;
const server = express();
const app = require("./home");
const services = require("./services");

server.use(app);
server.use(services);
server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
