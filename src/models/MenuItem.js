import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    desc: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
