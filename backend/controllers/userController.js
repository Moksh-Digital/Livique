import sendEmail from '../utils/sendEmail.js';

// TEMP: In-Memory Store for testing OTP flow (Replaces MongoDB)
// Key: email address, Value: { name, password, otp, otpExpires, isVerified }
const userStore = {};

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Step 1: Send OTP to user's email
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // Check if user already registered and verified
    if (userStore[email] && userStore[email].isVerified) {
        return res.status(400).json({ message: 'User already registered and verified. Please sign in.' });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Store or update temporary user data
    userStore[email] = {
        name,
        // In a real DB, password would be hashed here.
        password, 
        otp,
        otpExpires,
        isVerified: false
    };
    
    console.log(`Generated OTP for ${email}: ${otp}`);

    const emailResult = await sendEmail({
        to: email,
        subject: 'Your Account Verification Code (Test)',
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
        delete userStore[email]; // Clear temporary data if email fails
        res.status(500).json({ message: 'Error sending OTP email. Please check server logs.' });
    }
};


// @desc    Step 2: Verify OTP and finalize registration (in-memory)
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;
    const user = userStore[email];

    if (!user || user.isVerified) {
        return res.status(400).json({ message: 'Invalid request: User data not found or already verified.' });
    }

    // Check OTP and expiration
    if (user.otp !== otp) {
        return res.status(401).json({ message: 'Invalid OTP code.' });
    }
    if (user.otpExpires < Date.now()) {
        delete userStore[email]; // Clear expired data
        return res.status(401).json({ message: 'OTP expired. Please request a new one.' });
    }

    // OTP is valid: Finalize registration (mark as verified)
    user.isVerified = true;
    user.otp = undefined; // Clear OTP fields
    user.otpExpires = undefined;

    // Success response
    res.status(200).json({ // Use 200 OK for a successful login/auth response
        success: true,
        name: user.name,
        email: user.email,
        // In production: token: generateToken(user), 
        message: 'Account verified and user logged in automatically.',
    });
};


// @desc    Step 1: Send OTP for Sign In
// @route   POST /api/users/send-signin-otp
// @access  Public
const sendSigninOtp = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    // Check if user exists and is verified
    const user = userStore[email];
    if (!user || !user.isVerified) {
        return res.status(400).json({ message: 'User not found or account not verified. Please sign up first.' });
    }

    // Verify password
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password.' });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Store OTP for signin verification
    user.signinOtp = otp;
    user.signinOtpExpires = otpExpires;
    
    console.log(`Generated Signin OTP for ${email}: ${otp}`);

    const emailResult = await sendEmail({
        to: email,
        subject: 'Your Sign In Verification Code',
        html: `<p>Hello ${user.name},</p>
               <p>Your sign in verification code is: <strong>${otp}</strong></p>
               <p>This code is valid for 5 minutes.</p>`,
    });

    if (emailResult.success) {
        res.status(200).json({ 
            message: 'OTP sent successfully. Check your email to sign in.',
            email: email 
        });
    } else {
        res.status(500).json({ message: 'Error sending OTP email. Please check server logs.' });
    }
};

// @desc    Step 2: Verify Sign In OTP
// @route   POST /api/users/verify-signin-otp
// @access  Public
const verifySigninOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = userStore[email];

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

    // Success response
    res.status(200).json({
        success: true,
        name: user.name,
        email: user.email,
        message: 'Sign in successful.',
    });
};

// @desc    Authenticate user & get token (Login) - Legacy endpoint
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = userStore[email];

    if (user && user.isVerified && user.password === password) { // Simple password comparison (no hashing)
        res.json({
            name: user.name,
            email: user.email,
            message: 'Login successful (in-memory).',
        });
    } else if (user && !user.isVerified) {
        res.status(401).json({ message: 'Account not verified. Please complete email verification.' });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials or user not found.' });
    }
};

// Placeholder for protected route
const getUserProfile = (req, res) => {
    res.json({ message: 'User profile data (in-memory)' });
};

export {
    sendOtp,
    verifyOtpAndRegister,
    sendSigninOtp,
    verifySigninOtp,
    authUser,
    getUserProfile,
};