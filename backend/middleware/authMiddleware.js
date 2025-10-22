// This is a placeholder file for authentication middleware.
// In a real application, this function (protect) would handle
// verifying the user's JWT token sent in the Authorization header.

// const protect = (req, res, next) => {
//     // ------------------------------------------------------------------
//     // TO-DO: Implement JWT token verification logic here later.
//     // ------------------------------------------------------------------

//     // For now, in in-memory/test mode, we just let the request proceed.
//     console.log("--- Auth Middleware: Placeholder 'protect' executed (allowing request) ---");
    
//     // Call next() to pass control to the next middleware or route handler
//     next();
// };

// You can add other middleware functions here, like admin verification, etc.
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("JWT Verification Failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

export { protect };