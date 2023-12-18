import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  points: { type: Number, required: true, default: 0 },

  verificationCode: {
    type: String,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  password: {
    type: String,
  },
  avatar:{
    type:String,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};
const User = mongoose.model('User', userSchema);

export default User;
