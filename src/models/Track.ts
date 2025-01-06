import mongoose from "mongoose";
const { Schema } = mongoose;

const trackSchema = new Schema(
  {
    track_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    artist_id: { type: String, ref: "Artist", required: true },
    album_id: { type: String, ref: "Album", required: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Track || mongoose.model("Track", trackSchema);
