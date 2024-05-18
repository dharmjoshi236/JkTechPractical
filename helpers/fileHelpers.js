const path = require("path");
const url = require("url");
const fs = require("fs");

const convertLocalFileToUrl = (fileName) => {
  let filePath = path.join(__dirname, "../uploads", fileName);
  return url.pathToFileURL(filePath).href;
};

const readFileFromFileName = async (fileName) => {
  let filePath = path.join(__dirname, "../uploads", fileName);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(0);
      } else {
        console.log("data ", data);
        resolve(data);
      }
    });
  });
};

const unlinkFileByFileName = (fileName) => {
  let filePath = path.join(__dirname, "../uploads", fileName);
  fs.unlink(filePath, (err) => {
    console.log("error in unlink ", err);
  });
};

module.exports = {
  convertLocalFileToUrl,
  readFileFromFileName,
  unlinkFileByFileName,
};
