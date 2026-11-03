// const mongoose = require("mongoose");

// const urlSchema = new mongoose.Schema({
//   shortId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   redirectURL: {
//     type: String,
//     required: true,
//   },
//   visitHistory: [{ timestamp: { type: Number } }],
// });

// const UrlModel = mongoose.model('url',urlSchema);

// module.exports = UrlModel;


const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamp: { type: Number, default: Date.now },
        userDevice: { type: String }, // Records device / browser info
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("url", urlSchema);