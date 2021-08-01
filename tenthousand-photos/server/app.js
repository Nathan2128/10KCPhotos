const express = require("express");
const multer = require("multer");
const Photos = require("./models/photos");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//connecting to to mongoDB
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

//define how the files should be stored when received from client
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //where file will be stored
    cb(null, "server/photos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("photo");

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
app.use("/photos", express.static(path.join("server/photos")));

app.get("/api/photos", (req, res, next) => {
  Photos.find().then((response) => {
    console.log(response);
    res.status(200).json({
      photos: response,
    });
  });
});

app.post("/api/photos", upload, (req, res, next) => {
  // console.log("req,", req.body);
  const url = req.protocol + "://" + req.get("host");
  const photo = new Photos({
    caption: req.body.caption,
    photo: url + "/photos/" + req.file.filename,
  });
  console.log("in the post method");
  photo.save().then((response) => {
    res.status(201).json({
      message: "photo  added",
      photo: {
        id: response._id,
        caption: response.caption,
        imagePath: response.photo,
      },
    });
  });
});

app.put("/api/photos/:id", upload, (req, res, next) => {
  let imagePath  = req.body.photo;
  //using this if so that we handle cases where the image is not changed or it is changed
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/photos/" + req.file.filename
  }
  const photo = new Photos({
    _id: req.body._id,
    caption: req.body.caption,
    photo: imagePath
  });
  console.log('photo from serverside PUT', photo);
  Photos.updateOne(
    {
      _id: req.params.id,
    },
    photo
  ).then((response) => {
    // console.log("put response", response);
    res.status(200).json({
      message: "photo has been updated...",
    });
  });
});

app.delete("/api/photos/:id", (req, res, next) => {
  Photos.deleteOne({
    _id: req.params.id,
  }).then((response) => {
    res.status(204).json({
      message: "photo has been deleted...",
    });
  });
});

module.exports = app;
