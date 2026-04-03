const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // hides the identity of the server from the client and enforces security
const envAccess = require("dotenv");
const port = 619;
envAccess.config();

const server = express();

//middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ status: "success" });
});

server.listen(port, () => {
  console.log(`server is skibiding on port ${port}`);
});
