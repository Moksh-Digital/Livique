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

const router = express.Router();

// Public Routes
router.route('/send-otp').post(sendOtp); 
router.route('/verify-otp').post(verifyOtpAndRegister); 
router.route('/send-signin-otp').post(sendSigninOtp);
router.route('/verify-signin-otp').post(verifySigninOtp);
router.post('/login', authUser); 

// Private/Protected Route
router.route('/profile').get(protect, getUserProfile);


export default router;