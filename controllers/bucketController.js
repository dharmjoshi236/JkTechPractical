const {
  createBucket,
  listBucketPerUser,
  updateBucket,
  deleteBucket,
} = require("../services/bucketService");
const response = require("responsify-requests");
const { status, messages } = require("../constants/messages");

const createBucketController = async (req, res) => {
  try {
    const createBucketService = await createBucket(req.body, req.userId);

    if (createBucketService == 0) {
      return response(
        res,
        {},
        0,
        messages.BUCKET_CREATE_FAILURE,
        status.BAD_REQUEST
      );
    } else if (createBucketService == 2) {
      return response(res, {}, 0, messages.BUCKET_EXISTS, status.BAD_REQUEST);
    } else {
      return response(
        res,
        {},
        1,
        messages.BUCKET_CREATE_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in create bucket controller, ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const getListOfBucketsPerUserController = async (req, res) => {
  try {
    const getListService = await listBucketPerUser(req.userId);

    if (getListService == 0) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_FETCH_ERROR,
        status.BAD_REQUEST
      );
    } else if (getListService == 1) {
      return response(res, [], 1, messages.BUCKETS_NOT_FOUND, status.SUCCESS);
    } else {
      return response(
        res,
        getListService,
        1,
        messages.BUCKETS_FETCH_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in listing bucket controller, ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const updateBucketController = async (req, res) => {
  try {
    const updateBucketService = await updateBucket(req.body, req.userId);

    if (updateBucketService == 0) {
      return response(
        res,
        {},
        0,
        messages.BUCKET_UPDATE_FAILURE,
        status.BAD_REQUEST
      );
    } else if (updateBucketService == 2) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_NOT_FOUND,
        status.BAD_REQUEST
      );
    } else {
      return response(
        res,
        {},
        1,
        messages.BUCKET_UPDATE_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in update bucket controller ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const deleteBucketController = async (req, res) => {
  try {
    const deleteBucketService = await deleteBucket(req.body, req.userId);

    if (deleteBucketService == 0) {
      return response(
        res,
        {},
        0,
        messages.BUCKET_DELETE_FAILURE,
        status.BAD_REQUEST
      );
    } else if (deleteBucketService == 2) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_NOT_FOUND,
        status.BAD_REQUEST
      );
    } else {
      return response(
        res,
        {},
        1,
        messages.BUCKET_DELETE_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in delete bucket controller ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createBucketController,
  getListOfBucketsPerUserController,
  updateBucketController,
  deleteBucketController,
};
