const express = require("express");
const multer = require("multer");
const Photos = require("./models/photos");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://nate:DXV4IRMueVTQQnvR@10kc.cvfz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  });
// const uploads = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "server/photos");
//   },
// });

app.use((req, res, next) => {
  //avoid CORS error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/api/photos", (req, res, next) => {
  Photos.find().then((response) => {
    console.log(response);
    res.status(200).json({
      photos: response,
    });
  });
});

app.post("/api/photos", (req, res, next) => {
  console.log("req,", req.body);
  const photo = new Photos({
    caption: req.body.caption,
    // photo: "/photos/" + req.file.filename,
  });
  console.log("in the post method");
  photo.save().then((response) => {
    res.status(201).json({
      message: "post added",
      newPhotoId: response._id
    });
  });
});

module.exports = app;
