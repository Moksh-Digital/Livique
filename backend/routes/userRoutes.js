import express from 'express';
import {
    sendOtp,
    verifyOtpAndRegister,
    sendSigninOtp,
    verifySigninOtp,
    authUser,
    getUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/addressController.js";

const router = express.Router();

// Public Routes
router.route('/send-otp').post(sendOtp); 
router.route('/verify-otp').post(verifyOtpAndRegister); 
router.route('/send-signin-otp').post(sendSigninOtp);
router.route('/verify-signin-otp').post(verifySigninOtp); // now returns JWT
router.post('/login', authUser); // optional legacy

// Private/Protected Route
router.get("/profile", protect, getUserProfile);

router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route('/addresses/:id/default')
  .put(protect, setDefaultAddress);


export default router;
