const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/result',
	passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'google' },
      });
	  if (exUser) {
		exUser.redirectURL = req.session.redirectURL;
		req.session.redirectURL = null;
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile?.emails[0].value,
          name: profile.displayName,
          snsId: profile.id,
          provider: 'google',
        });
		newUser.redirectURL = req.session.redirectURL;
		req.session.redirectURL = null;
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};