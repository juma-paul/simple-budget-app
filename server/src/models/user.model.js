import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      default: null,
      trim: true,
    },
    lastName: {
      type: String,
      default: null,
      trim: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    acceptedTerms: {
      type: Boolean,
      default: false,
    },
    acceptedPrivacy: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletionScheduledAt: {
      type: Date,
      default: null,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create user from the above schema
const User = mongoose.model("User", userSchema);
export default User;
