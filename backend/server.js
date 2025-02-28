const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

require("./app/models/expense.model.js");

// Configuring the database
require("dotenv").config();
const mongoose = require("mongoose");

// Connecting to the database
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require("./app/routes/expense.router.js")(app);

// Create a Server
const server = app.listen(8080, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
