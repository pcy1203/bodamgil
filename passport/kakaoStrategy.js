const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
	clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/result',
	passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
	try {
	  const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });
	  if (exUser) {
		exUser.redirectURL = req.session.redirectURL;
		req.session.redirectURL = null;
        done(null, exUser);
	  } else {
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email,
          name: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
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