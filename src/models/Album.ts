import mongoose from "mongoose";
import Artist from "./Artist";
const { Schema } = mongoose;

const albumSchema = new Schema(
  {
    album_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    hidden: { type: Boolean, default: false },
    artist_id: { type: String, ref: Artist, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Album || mongoose.model("Album", albumSchema);
