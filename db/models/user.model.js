import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryEmail: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    confirmed: { type: Boolean, default: false },
    passwordChangeAt: { type: Date } // Add this field
}, { timestamps: true });

const User = model('User', userSchema);

export default User;
