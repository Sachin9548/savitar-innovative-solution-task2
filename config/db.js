const mongoose = require("mongoose");
const DB_URL = `mongodb+srv://learnhighlight121:c8pJSWsRpUMgnAFV@mern.s2qw3qu.mongodb.net/savitartask2?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
