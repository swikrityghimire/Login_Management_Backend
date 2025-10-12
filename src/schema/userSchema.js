import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    fullName: { type: String, required: [true, "fullName is required."] },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
    },
    password: { type: String, required: [true, "password is required."] },

    dob: { type: Date, required: [true, "dob is required."] },
    gender: { type: String, required: [true, "gender is required."] },
    role: { type: String, required: [true, "role is required."] },
    isVerifiedEmail: {
      type: String,
      required: [true, "isVerifiedEmail is required."],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const User = model("User", userSchema);

export default User;
