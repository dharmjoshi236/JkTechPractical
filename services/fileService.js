const userModel = require("../models/userModel");
const bucketModel = require("../models/bucketModel");
const fileModel = require("../models/fileModel");
const mongoose = require("mongoose");
const {
  convertLocalFileToUrl,
  unlinkFileByFileName,
} = require("../helpers/fileHelpers");

const uploadFile = async (fileData, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: fileData.bucketId,
      userId: userId,
    });
    if (!findBucketById) {
      return 2; // No bucket found, to upload file
    } else {
      let createFileData = await fileModel.create({
        ...fileData,
        bucketId: findBucketById._id,
      });

      if (!createFileData) {
        return 0; // Unable to upload the file, try again
      } else {
        return 1; // File uploaded successfully
      }
    }
  } catch (error) {
    console.log("error in upload file service", error);
    throw new Error();
  }
};

const getFileListPerBucket = async (reqBody, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: reqBody.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return 2; // Unable to find bucket.
    } else {
      const list = await fileModel.aggregate([
        {
          $lookup: {
            from: "buckets",
            localField: "bucketId",
            foreignField: "_id",
            as: "bucketDetails",
          },
        },
        {
          $unwind: {
            path: "$bucketDetails",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            "bucketDetails._id": new mongoose.Types.ObjectId(reqBody.bucketId),
          },
        },
        {
          $addFields: {
            fileUrl: { $concat: [convertLocalFileToUrl("/"), "$fileName"] },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      if (list.length == 0) {
        return 1; // No files found in given bucket
      } else {
        return list;
      }
    }
  } catch (error) {
    console.log("error in getting file list service", error);
    throw new Error();
  }
};

const deleteFile = async (reqBody, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: reqBody.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return 2; // Unable to find bucket.
    } else {
      const getFile = await fileModel.findOne({
        _id: reqBody.fileId,
        bucketId: findBucketById._id,
      });

      if (!getFile) {
        return 3; // File is either deleted or not found
      } else {
        let fileName = getFile.fileName;
        let deleteFile = await fileModel.deleteOne({ _id: reqBody.fileId });

        if (!deleteFile) {
          return 0; // Unable to delete the file
        } else {
          unlinkFileByFileName(fileName);
          return 1; // File deleted successfully
        }
      }
    }
  } catch (error) {
    console.log("error in delete file service", error);
    throw new Error();
  }
};

const getFileById = async (reqBody, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: reqBody.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return 2; // Unable to find bucket.
    } else {
      const findFile = await fileModel.findOne({
        _id: reqBody.fileId,
        bucketId: findBucketById._id,
      });

      if (!findFile) {
        return 0; // Unable to find the file
      } else {
        const fileName = findFile.fileName;
        let fileUrl = convertLocalFileToUrl(fileName);
        return { ...findFile._doc, fileUrl: fileUrl };
      }
    }
  } catch (error) {
    console.log("error in getting file details service", error);
    throw new Error();
  }
};

module.exports = {
  uploadFile,
  getFileListPerBucket,
  deleteFile,
  getFileById,
};
