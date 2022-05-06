const connectDB = require("./config/db");
const express = require("express");
const app = express();
const path = require("path");

//Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false })); // equivalent to bodyparser

// define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

//serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
