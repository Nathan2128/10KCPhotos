const express = require("express");
const app = express();
const multer = require("multer");

const uploads = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "server/photos")
    }
})

app.use((req, res, next) => {
  //avoid CORS error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, Accept, X-Requested-With, Content-Type");
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/api/photos", (req, res, next) => {
  const photos = [
    {
      id: "1234",
      caption: "Ezra is hungry!",
      imagePath: "assets/aadhav-bites-foot.jpeg",
    },
    {
      id: "1235",
      caption: "I learned how to open the window!",
      imagePath: "assets/aadhav-window.jpeg",
    },
  ];

  res.status(200).json({
    photos,
  });
});

app.post("/api/photos", multer(uploads).single("photo"), (req, res, next) => {
    const photo = req.body;
    console.log(photo);
    res.status(201).json({
        message: 'post added'
    })
});

module.exports = app;
