const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Voosh-Auth-API/src/Models/userModel');

passport.use(new GoogleStrategy({
    clientID: '369041213499-5b4iviup487ukp16ic3k579lovcf3p99.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Create new user if not found
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          // Add more fields as needed
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
