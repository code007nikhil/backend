import dotenv from "dotenv";
import app from "./app.js";
import crypto from "crypto";
import connectDB from "./config/db.js";
if (!global.crypto) {
  global.crypto = crypto.webcrypto;
}
dotenv.config();

const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("PORT:", process.env.PORT);
  console.log("MONGO:", mongoURI);
});