import User from '../models/userModel.js'; // Import the MongoDB User model
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs'; // Used for comparing passwords on signin

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Step 1: Send OTP to user's email for Sign Up
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
        // User is fully registered
        return res.status(400).json({ message: 'User already registered and verified. Please sign in.' });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    try {
        let user;

        if (existingUser && !existingUser.isVerified) {
            // User exists but is unverified (update their details and OTP)
            user = existingUser;
            user.name = name;
            // NOTE: user.password will be re-hashed by the pre-save hook if it's changed.
            // We set it here, and the hook in userModel.js handles the hashing.
            user.password = password; 
            user.otp = otp;
            user.otpExpires = otpExpires;
        } else {
            // New user, create a new document
            user = await User.create({
                name,
                email,
                password, // Password hashing happens via pre-save hook
                otp,
                otpExpires,
                isVerified: false
            });
        }
        
        await user.save(); // Save the new/updated user data to MongoDB

        console.log(`Generated OTP for ${email}: ${otp}`);

        const emailResult = await sendEmail({
            to: email,
            subject: 'Your Account Verification Code',
            html: `<p>Hello ${name},</p>
                   <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
                   <p>This code is valid for 5 minutes.</p>`,
        });

        if (emailResult.success) {
            res.status(200).json({
                message: 'OTP sent successfully. Check your email to proceed.',
                email: email
            });
        } else {
            // IMPORTANT: In a real app, you might *not* delete the user here, but flag the email attempt failure.
            // For this setup, we'll keep the user record as the OTP is already generated and saved.
            res.status(500).json({ message: 'Error sending OTP email. Please check server logs.' });
        }
    } catch (error) {
        console.error("Database or Server Error:", error);
        res.status(500).json({ message: 'An error occurred during sign up process.' });
    }
};


// @desc    Step 2: Verify OTP and finalize registration
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found. Please sign up first.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified. Please sign in.' });
        }

        // Check OTP and expiration
        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP code.' });
        }
        if (user.otpExpires < Date.now()) {
            // Note: Keeping the user record, but suggesting a resend.
            return res.status(401).json({ message: 'OTP expired. Please request a new one.' });
        }

        // OTP is valid: Finalize registration (mark as verified)
        user.isVerified = true;
        user.otp = undefined; // Clear OTP fields
        user.otpExpires = undefined;
        await user.save();

        // Success response
        res.status(200).json({
            success: true,
            name: user.name,
            email: user.email,
            // In production: token: generateToken(user),
            message: 'Account verified and user logged in automatically.',
        });

    } catch (error) {
        console.error("Database or Server Error:", error);
        res.status(500).json({ message: 'An error occurred during OTP verification.' });
    }
};


// @desc    Step 1: Send OTP for Sign In
// @route   POST /api/users/send-signin-otp
// @access  Public
const sendSigninOtp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    try {
        // 1. Check if user exists and is verified
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            // Crucial: This covers both 'user not found' AND 'account not verified'
            return res.status(400).json({ message: 'Invalid credentials or account not verified. Please sign up.' });
        }

        // 2. Verify password using bcrypt (matchPassword method is defined in userModel)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials or account not verified. Please sign up.' });
        }

        // 3. Generate and store Signin OTP
        const signinOtp = generateOTP();
        const signinOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        user.signinOtp = signinOtp;
        user.signinOtpExpires = signinOtpExpires;
        await user.save(); // Save the new OTP and expiry

        console.log(`Generated Signin OTP for ${email}: ${signinOtp}`);

        const emailResult = await sendEmail({
            to: email,
            subject: 'Your Sign In Verification Code',
            html: `<p>Hello ${user.name},</p>
                   <p>Your sign in verification code is: <strong>${signinOtp}</strong></p>
                   <p>This code is valid for 5 minutes.</p>`,
        });

        if (emailResult.success) {
            res.status(200).json({
                message: 'Sign-in OTP sent successfully. Check your email to sign in.',
                email: email
            });
        } else {
            // Note: Not clearing the OTP, allowing a resend/retry.
            res.status(500).json({ message: 'Error sending sign-in OTP email. Please check server logs.' });
        }
    } catch (error) {
        console.error("Database or Server Error:", error);
        res.status(500).json({ message: 'An error occurred during sign in process.' });
    }
};

// @desc    Step 2: Verify Sign In OTP
// @route   POST /api/users/verify-signin-otp
// @access  Public
const verifySigninOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ message: 'User not found or account not verified.' });
        }

        // Check OTP and expiration
        if (user.signinOtp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP code.' });
        }
        if (user.signinOtpExpires < Date.now()) {
            return res.status(401).json({ message: 'OTP expired. Please request a new one.' });
        }

        // OTP is valid: Clear signin OTP and return user data
        user.signinOtp = undefined;
        user.signinOtpExpires = undefined;
        await user.save();

        // Success response
        res.status(200).json({
            success: true,
            name: user.name,
            email: user.email,
            message: 'Sign in successful.',
        });
    } catch (error) {
        console.error("Database or Server Error:", error);
        res.status(500).json({ message: 'An error occurred during OTP sign in verification.' });
    }
};

// @desc    Authenticate user & get token (Login) - Legacy endpoint (kept for completeness)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && user.isVerified && (await user.matchPassword(password))) {
            res.json({
                name: user.name,
                email: user.email,
                message: 'Login successful.',
            });
        } else if (user && !user.isVerified) {
            res.status(401).json({ message: 'Account not verified. Please complete email verification.' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials or user not found.' });
        }
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


// Placeholder for protected route
const getUserProfile = (req, res) => {
    // In a real application, req.user would be set by the 'protect' middleware after JWT verification
    res.json({ message: 'User profile data (using MongoDB, requires JWT protect middleware to work fully)' });
};

export {
    sendOtp,
    verifyOtpAndRegister,
    sendSigninOtp,
    verifySigninOtp,
    authUser,
    getUserProfile,
};