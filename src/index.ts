import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoute from "./routes/authRouter";
import userRoute from "./routes/userRouter";
import artistRoute from "./routes/artistRouter";
import albumRoute from "./routes/albumRouter";
import trackRoute from "./routes/trackRouter";
import favoriteRoute from "./routes/favoriteRouter";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/healthCheck", (req, res) => {
  res.status(200).send("Heath check successfull!");
});
app.use("/", authRoute);
app.use("/users", userRoute);
app.use("/artists", artistRoute);
app.use("/albums", albumRoute);
app.use("/tracks", trackRoute);
app.use("/favorites", favoriteRoute);

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
