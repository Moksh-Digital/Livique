import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ADD THIS LINE

const addressSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    houseNo: { type: String },
    street: { type: String, required: true },
    landmark: { type: String },
    locality: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    addressType: { type: String, default: "home" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () { return !this.googleId; } },
    googleId: { type: String }, // <-- Google login users
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    isAdmin: { type: Boolean, default: false },
    signinOtp: String,
    signinOtpExpires: Date,
    // --- NEW: Password Reset Fields ---
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // ---------------------------------
    cart: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: { type: String },
        deliveryCharge: { type: Number, default: 0 },
      },
    ],
    addresses: [addressSchema], // <-- embed addresses
  },
  { timestamps: true }
);

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ADD THIS NEW METHOD
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token will expire in 30 days
  });
};

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;