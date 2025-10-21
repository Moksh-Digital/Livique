import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      // Tracks if the user has completed OTP verification
      type: Boolean,
      default: false,
    },
    otp: String, // Temporary storage for the OTP
    otpExpires: Date, // Expiration time for the OTP
    isAdmin: {
      type: Boolean,
      default: false,
    },
    signinOtp: String, // Temporary storage for the Sign In OTP
    signinOtpExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Instance Method: Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save Middleware: Hash password before saving if it has been modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
