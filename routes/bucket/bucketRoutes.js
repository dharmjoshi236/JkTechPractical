const express = require("express");
const {
  createBucketController,
  getListOfBucketsPerUserController,
  updateBucketController,
  deleteBucketController,
} = require("../../controllers/bucketController");
const { authenticateUser } = require("../../middlewares/authenticateUser");
const router = express.Router();

router.post("/create", authenticateUser, createBucketController);
router.post("/get-list", authenticateUser, getListOfBucketsPerUserController);
router.patch("/update", authenticateUser, updateBucketController);
router.post("/delete", authenticateUser, deleteBucketController);

module.exports = router;
