const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
	if (authError) {
	  console.error(authError);
	  return next(authError);
	}
	if (!user) {
	  return res.redirect(`/login?message=${info.message}`);
	}
	return req.login(user, (loginError) => {
	  if (loginError) {
		console.error(loginError);
		return next(loginError);
	  }
	  return res.redirect('/');
	})
  })(req, res, next);
};

	
exports.logout = (req, res) => {
  req.logout(() => {
	res.redirect('/');
  });
};
	
exports.signup = async (req, res, next) => {
  const { email, password, confirm } = req.body;
  try {
	const exUser = await User.findOne({ where: { email } });
	if (exUser) {
	  return res.redirect('/signup?message=existUserError');
	}
	if (password !== confirm) {
	  return res.redirect('/signup?message=passwordError');
	}
	const hash = await bcrypt.hash(password, 12);
	await User.create({
	  email,
	  password: hash,
	});
	return res.redirect('/?message=signupSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};
