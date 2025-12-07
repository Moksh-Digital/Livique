import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// ----------------------------------------
// URL CONFIG (no BACKEND_URL env needed)
// ----------------------------------------

// Server side pe `window` nahi hota, isliye yahan env se hi pata chalega
// ki production hai ya local. Ye normal hai backend me.
const isProduction = process.env.NODE_ENV === "production";

// ✅ Local:  http://localhost:5000
// ✅ Live:   https://api.livique.co.in
const BACKEND_URL = isProduction
  ? "https://api.livique.co.in"
  : "http://localhost:5000";

// ✅ Local frontend:  http://localhost:8080
// ✅ Live frontend:   https://www.livique.co.in  (ya sirf https://livique.co.in)
const CLIENT_URL = isProduction
  ? "https://www.livique.co.in"
  : "http://localhost:8080";

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
