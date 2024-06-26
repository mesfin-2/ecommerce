const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("db connected Successfully");
  } catch (error) {
    console.log("DB error");
  }
};

module.exports = dbConnect;
