import crypto from "crypto";
if (!global.crypto) {
  global.crypto = crypto.webcrypto;
}
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("PORT:", process.env.PORT);
  console.log("MONGO:", mongoURI);
});