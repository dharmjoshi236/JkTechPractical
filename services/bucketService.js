const bucketModel = require("../models/bucketModel");

const createBucket = async (reqBody, userId) => {
  try {
    const checkIfBucketExists = await bucketModel.findOne({
      bucketName: reqBody.bucketName,
      userId: userId,
    });

    if (checkIfBucketExists) {
      return 2; // Bucket with same name already exists
    } else {
      const create = await bucketModel.create({ ...reqBody, userId: userId });

      if (!create) {
        return 0; // Unable to create the bucket try again
      } else {
        return 1; // Bucket created successfully
      }
    }
  } catch (error) {
    console.log("error in create bucket service ", error);
    throw new Error();
  }
};

const listBucketPerUser = async (userId) => {
  try {
    const getBuckets = await bucketModel.find({
      userId: userId,
    });

    if (!getBuckets) {
      return 0; // Unable to get the buckets, Try again
    } else {
      if (getBuckets.length == 0) {
        return 1; // No buckets found
      } else {
        return getBuckets;
      }
    }
  } catch (error) {
    console.log("error in list bucket per user service, ", error);
    throw new Error();
  }
};

const updateBucket = async (reqBody, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: reqBody.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return 0; // No bucket found
    } else {
      const updateBucket = await bucketModel.updateOne(
        { _id: reqBody.bucketId },
        {
          bucketName: reqBody.bucketName,
        },
        { new: true }
      );

      if (!updateBucket) {
        return 2; // unable to update the bucket details, try again
      } else {
        return 1; // Bucket updated successfully
      }
    }
  } catch (error) {
    console.log("error in update bucket service, ", error);
    throw new Error();
  }
};

const deleteBucket = async (reqBody, userId) => {
  try {
    const findBucketById = await bucketModel.findOne({
      _id: reqBody.bucketId,
      userId: userId,
    });

    if (!findBucketById) {
      return 2; // Unable to find the bucket
    } else {
      let deleteBucket = await bucketModel.deleteOne({
        _id: findBucketById._id,
      });

      if (!deleteBucket) {
        return 0; // Unable to delete the bucket, try again
      } else {
        return 1; // Bucket deleted successfully
      }
    }
  } catch (error) {
    console.log("error in delete bucket service, ", error);
    throw new Error();
  }
};

module.exports = {
  createBucket,
  listBucketPerUser,
  updateBucket,
  deleteBucket,
};
