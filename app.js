require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// import route
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// middleware
app.use(express.json());

// middleware route
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  try {
    // connect to db
    await mongoose.connect(process.env.MONGO_URI, () => {
      console.log("connected to DB");
    });
    console.log(`app is listening on ${port}... `);
  } catch (error) {
    console.log(error);
  }
});
