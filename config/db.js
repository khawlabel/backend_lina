const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = mongoose.connect("mongodb://127.0.0.1:27017/user-account-backend");
        console.log("Database Connected Successfully");
      } catch (error) {
        console.log("DAtabase error");
      }
};

module.exports = connectDB;
