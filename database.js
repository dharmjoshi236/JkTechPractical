const mongoose = require("mongoose");
const envConstants = require("./constants/envConstants");
const connectDb = async () => {
  await mongoose
    .connect(envConstants.mongoDbConnectionUrl)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Unable to connect to database ", error);
    });
};

module.exports = connectDb;
