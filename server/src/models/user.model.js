import mongoose from "mongoose";

const DEFAULT_AVATAR_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/the-simple-budget-app.firebasestorage.app/o/default-avatar.png?alt=media&token=91cb9d8f-ac32-409d-b53a-83212881bdf0";

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
      default: DEFAULT_AVATAR_IMAGE,
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
  },
  { timestamps: true }
);

// Create user from the above schema
const User = mongoose.model("User", userSchema);
export default User;
