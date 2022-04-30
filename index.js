const express = require("express");
const cors = require("cors");
require("dotenv").config();
const contedDB = require("./config/config");
const webRoute = require("./api/web");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(webRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

contedDB.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
