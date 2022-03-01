const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Serve static files....
app.use(express.static(__dirname + "/build"));

// Send all requests to index.html
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

// default Heroku PORT
app.listen(process.env.PORT || 9000);

// cors funciton
app.use(cors({
  origin: '*'
}));