import express from 'express';
import {
    sendOtp,
    verifyOtpAndRegister,
    sendSigninOtp,
    verifySigninOtp,
    authUser,
    getUserProfile,
    updateProfile,
      changePassword,
    // --- NEW IMPORTS ---
    forgotPassword,
    validateResetToken,
    resetPassword,
    // -------------------
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/addressController.js";
import User from "../models/userModel.js";
import passport from "../config/passport.js";



const router = express.Router();

// Public Routes
router.route('/send-otp').post(sendOtp); 
router.route('/verify-otp').post(verifyOtpAndRegister); 
router.route('/send-signin-otp').post(sendSigninOtp);
router.route('/verify-signin-otp').post(verifySigninOtp); // now returns JWT
router.post('/login', authUser); // optional legacy

// --- NEW FORGOT PASSWORD ROUTES ---
router.route('/forgot-password').post(forgotPassword);
router.route('/validate-reset-token').post(validateResetToken);
router.route('/reset-password').post(resetPassword);
// ----------------------------------

// Private/Protected Route
router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route('/addresses/:id/default')
  .put(protect, setDefaultAddress);

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


export default router;