const rateLimit = require("express-rate-limit"); // library to implement rate limiting
const limiter = rateLimit({
  windowMs: 4 /*(4 min) */ * 60 /*(60 sec) */ * 1000 /*(1000ms)*/, //input value in milliSecond
  max: 50, //in the particular timeframe each device can ping a max of 50 rerquests
  message: {
    status: "error",
    message: "Too many requests from this device, please try again later.",
  },
});
module.exports = { limiter };
