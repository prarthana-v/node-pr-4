const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      `mongodb+srv://pdvaghani:pdvaghani@cluster0.quhpv.mongodb.net/`
    );
    console.log(`mongodb connect ${con.connection.host}`);
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = connectDB;
