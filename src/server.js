const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // hides the identity of the server from the client and enforces security
const envAccess = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/financialRecordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
envAccess.config();

const server = express();

//middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/auth", authRoutes);
server.use("/records", recordRoutes);
server.use("/dashboard", dashboardRoutes);

server.get("/", (req, res) => {
  // test
  res.status(200).json({ status: "success" });
});

server.listen(process.env.PORT, () => {
  console.log(`server is skibiding on port ${process.env.PORT}`);
});
