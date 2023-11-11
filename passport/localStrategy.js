const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true,
  }, async (req, email, password, done) => {
	try {
	  const exUser = await User.findOne({ where: { email } });
	  if (exUser) {
		const result = await bcrypt.compare(password, exUser.password);
		if (result) {
		  exUser.redirectURL = req.session.redirectURL;
		  req.session.redirectURL = null;
		  done(null, exUser);
		} else {
		  done(null, false, { message: 'passwordError' });
		}
	  } else {
		done(null, false, { message: 'noUserError' });
	  }
	} catch (error) {
	  console.error(error);
	  done(error);
	}
  }));
};