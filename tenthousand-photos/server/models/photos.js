const mongoose = require("mongoose");

const photosSchema = mongoose.Schema({
  caption: { type: String, required: true },
  photo: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Photos", photosSchema);
