const express = require("express");
const {
  uploadFileController,
  getFileListController,
  deleteFileController,
  getFileByIdController,
} = require("../../controllers/fileController");
const { authenticateUser } = require("../../middlewares/authenticateUser");
const upload = require("../../middlewares/multerFileUpload");
const router = express.Router();

router.post("/upload", authenticateUser, upload.any(), uploadFileController);
router.post("/get-list", authenticateUser, getFileListController);
router.post("/delete", authenticateUser, deleteFileController);
router.post("/get", authenticateUser, getFileByIdController);

module.exports = router;
