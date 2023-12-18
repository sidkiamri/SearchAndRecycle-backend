import User from "./user.mjs";
import mongoose from "mongoose";

const recyclingWasteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  acceptedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WasteType' }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

recyclingWasteSchema.post('save', async (doc) => {
  try {
    const userToUpdate = await User.findById(doc.userId);
    if (userToUpdate) {
      userToUpdate.points += 5;
      await userToUpdate.save();
    }
  } catch (error) {
    console.log(error);
  }
});

export default mongoose.model('RecyclingWaste', recyclingWasteSchema);

