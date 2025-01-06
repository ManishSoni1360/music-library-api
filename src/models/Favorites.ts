import mongoose from "mongoose";
const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    favorite_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: "User", required: true },
    category: {
      type: String,
      enum: ["artist", "album", "track"],
      required: true,
    },
    item_id: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", favoriteSchema);
