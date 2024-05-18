const {
  uploadFile,
  getFileListPerBucket,
  deleteFile,
  getFileById,
} = require("../services/fileService");
const response = require("responsify-requests");
const { messages, status } = require("../constants/messages");
const { convertLocalFileToUrl } = require("../helpers/fileHelpers");

const uploadFileController = async (req, res) => {
  try {
    let files = req.files;
    let fileData;
    let fileUrl = convertLocalFileToUrl(files[0]?.filename);

    if (files.length == 1 && files[0].fieldname == "file") {
      fileData = {
        fileName: files[0]?.filename,
        fileType: files[0]?.mimetype,
        fileSize: files[0]?.size,
        bucketId: req.body.bucketId,
      };

      let fileUploadService = await uploadFile(fileData, req.userId);

      if (fileUploadService == 2) {
        return response(
          res,
          {},
          0,
          messages.BUCKETS_NOT_FOUND,
          status.BAD_REQUEST
        );
      } else if (fileUploadService == 0) {
        return response(
          res,
          {},
          0,
          messages.FILE_UPLOAD_FAILURE,
          status.BAD_REQUEST
        );
      } else {
        return response(
          res,
          { fileUrl: fileUrl },
          1,
          messages.FILE_UPLOAD_SUCCESS,
          status.SUCCESS
        );
      }
    } else {
      return response(res, {}, 0, messages.ONLY_ONE_FILE, status.BAD_REQUEST);
    }
  } catch (error) {
    console.log("error in uploadFileCotroller ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const getFileListController = async (req, res) => {
  try {
    const getListService = await getFileListPerBucket(req.body, req.userId);

    if (getListService == 2) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_NOT_FOUND,
        status.BAD_REQUEST
      );
    } else if (getListService == 1) {
      return response(res, [], 1, messages.FILE_FETCH_FAILURE, status.SUCCESS);
    } else {
      return response(
        res,
        getListService,
        1,
        messages.FILE_FETCH_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in get file list controller ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const deleteFileController = async (req, res) => {
  try {
    const deleteFileService = await deleteFile(req.body, req.userId);

    if (deleteFileService == 0) {
      return response(
        res,
        {},
        0,
        messages.FILE_DELETE_FAILURE,
        status.BAD_REQUEST
      );
    } else if (deleteFileService == 2) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_NOT_FOUND,
        status.BAD_REQUEST
      );
    } else if (deleteFileService == 3) {
      return response(
        res,
        {},
        0,
        messages.FILE_ALREADY_DELETED,
        status.BAD_REQUEST
      );
    } else {
      return response(res, {}, 1, messages.FILE_DELETE_SUCCESS, status.SUCCESS);
    }
  } catch (error) {
    console.log("error in deleteFileController ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};

const getFileByIdController = async (req, res) => {
  try {
    const getFileService = await getFileById(req.body, req.userId);

    if (getFileService == 2) {
      return response(
        res,
        {},
        0,
        messages.BUCKETS_NOT_FOUND,
        status.BAD_REQUEST
      );
    } else if (getFileService == 0) {
      return response(res, {}, 0, messages.FILES_NOT_FOUND, status.BAD_REQUEST);
    } else {
      return response(
        res,
        getFileService,
        1,
        messages.FILE_FETCH_SUCCESS,
        status.SUCCESS
      );
    }
  } catch (error) {
    console.log("error in getFileById ", error);
    return response(res, {}, 0, messages.INTERNAL_SERVER_ERROR);
  }
};
module.exports = {
  uploadFileController,
  getFileListController,
  deleteFileController,
  getFileByIdController,
};
