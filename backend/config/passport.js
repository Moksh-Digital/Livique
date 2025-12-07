import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// ----------------------------------------
// URL CONFIG
// ----------------------------------------

// Use explicit env vars if set, otherwise detect based on deployment
const BACKEND_URL = process.env.BACKEND_URL || (process.env.NODE_ENV === "production"
  ? "https://api.livique.co.in"
  : "http://localhost:5000");

const CLIENT_URL = process.env.CLIENT_URL || (process.env.NODE_ENV === "production"
  ? "https://www.livique.co.in"
  : "http://localhost:8080");

// ----------------------------------------
// GOOGLE STRATEGY
// ----------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/users/auth/google/callback`,
    },
    // verify callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        const email = profile.emails?.[0]?.value;

        // ✅ If not found by googleId, try by email
        if (!user) {
          if (email) {
            user = await User.findOne({ email });
          }

          if (user) {
            // Existing normal account -> link googleId
            user.googleId = profile.id;
          } else {
            // New user through google
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              isVerified: true,
            });
          }

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ----------------------------------------
// SESSION SERIALIZATION
// ----------------------------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export { CLIENT_URL }; // optional: agar server.js me istemaal karna ho
export default passport;
