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
  // TODO - 유효성 검사 추가하기
  const { email, password, confirm, name, introduction, gender, birth } = req.body;
  try {
	const exUser = await User.findOne({ where: { email } });
	if (exUser) {
	  return res.redirect('/signup?message=existUserError');
	}
	if (password !== confirm) {
	  return res.redirect('/signup?message=passwordError');
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	// TODO - 기본 이미지 지정하기
	const newUser = await User.create({
	  email,
	  password: hashedPassword,
	  name,
	  introduction,
	  image: req.file?.filename ? `profile/${req.file.filename}` : null,
	  gender,
	  birthDate: new Date(birth[0], Number(birth[1]) - 1, birth[2]),
	});
	return res.redirect('/?message=signupSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};