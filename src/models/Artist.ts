import mongoose from "mongoose";
const { Schema } = mongoose;

const artistSchema = new Schema(
  {
    artist_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    grammy: { type: Number, required: true },
    hidden: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Artist || mongoose.model("Artist", artistSchema);
