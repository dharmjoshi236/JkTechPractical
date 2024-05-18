const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    bucketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buckets",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const fileModel = mongoose.model("files", fileSchema);
module.exports = fileModel;
