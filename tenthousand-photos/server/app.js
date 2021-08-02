const express = require("express");
const multer = require("multer");
const Photos = require("./models/photos");
const User = require("./models/users");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("./authenticated");

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
    "Origin, Accept, X-Requested-With, Content-Type, Authorization"
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

app.post("/api/photos", authToken, upload, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const photo = new Photos({
    caption: req.body.caption,
    photo: url + "/photos/" + req.file.filename,
    createdBy: req.userData.userId,
  });
  photo.save().then((response) => {
    res.status(201).json({
      message: "photo  added...",
      photo: {
        id: response._id,
        caption: response.caption,
        imagePath: response.photo,
      },
    });
  });
});

app.put("/api/photos/:id", authToken, upload, (req, res, next) => {
  let imagePath = req.body.photo;
  //using this if so that we handle cases where the image is not changed or it is changed
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/photos/" + req.file.filename;
  }
  const photo = new Photos({
    _id: req.body._id,
    caption: req.body.caption,
    photo: imagePath,
  });
  console.log("photo from serverside PUT", photo);
  Photos.updateOne(
    {
      _id: req.params.id,
      createdBy: req.userData.userId,
    },
    photo
  ).then((response) => {
    // console.log("put response", response);
    if(response.nModified > 0) { //update has taken place
      res.status(200).json({ message: "photo has been updated..."})
    } else {
      res.status(401).json({ message: "this user can not perform this action..."})
    }
  });
});

app.delete("/api/photos/:id", authToken, (req, res, next) => {
  Photos.deleteOne({
    _id: req.params.id,
    createdBy: req.userData.userId
  }).then((response) => {
    if(response.n > 0) { //update has taken place
      res.status(200).json({ message: "photo has been updated..."})
    } else {
      res.status(401).json({ message: "this user can not perform this action..."})
    }
  });
});

app.post("/api/users/register", (req, res, next) => {
  //using 5 for salt rounds because this is not a prod app
  bcrypt.hash(req.body.password, 5).then((hashedPassword) => {
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    user
      .save()
      .then((response) => {
        res.status(201).json({
          message: "User has been created...",
          user: response,
        });
      })
      .catch((error) => {
        res.status(409).json({
          error,
        });
      });
  });
});

app.post("/api/users/login", (req, res, next) => {
  let appUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User does not exist..",
        });
      }
      appUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((response) => {
      //response will be true if password matches
      if (!response) {
        return res.status(401).json({
          message: "Invalid password..",
        });
      }
      //expiresIn is 2h for testing purposes
      const token = jwt.sign(
        { email: appUser.email, userId: appUser._id },
        "10KC_secret",
        { expiresIn: "2h" }
      );
      res.status(200).json({
        token,
        expiresIn: "7200",
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Authentication process failed...",
      });
    });
});

module.exports = app;
