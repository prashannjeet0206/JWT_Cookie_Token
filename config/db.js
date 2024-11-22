const mongoose = require("mongoose");

const DBConnect = async (req, res) => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("DB Connection is Successful");
  } catch (error) {
    console.log("DB Connection failed");
  }
};

module.exports = DBConnect;
