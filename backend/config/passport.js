import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// Backend base URL env se lo
// Local dev:  http://localhost:5000
// Server:     http://64.227.146.210:5000  (baad me https + domain)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        const email = profile.emails[0].value;

        // ✅ If already signed up manually, link Google
        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
          } else {
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
