const bcrypt = require('bcrypt');
const passport = require('passport');
const fs = require('fs');
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
	  const redirectURL = req.body.redirect ? req.body.redirect : "/";
	  return res.redirect(redirectURL);
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
  // introduction 없음
  // 전화번호 저장 필요
  const { email, password, confirm, name, introduction, gender,
		 birthyear, birthmonth, birthday } = req.body;
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
	  birthDate: new Date(birthyear, Number(birthmonth) - 1, birthday),
	});
	return res.redirect('/signup/success');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.setprofile = async (req, res, next) => {
  // TODO - 유효성 검사 추가하기
  const { name, introduction, gender, birthyear, birthmonth, birthday } = req.body;
  const hasImage = req.file?.filename !== undefined;
  try {
	await User.update({
	  name,
	  introduction,
	  image: req.file?.filename ? `profile/${req.file.filename}` : req.user.dataValues.image,
	  gender,
	  birthDate: new Date(birthyear, Number(birthmonth) - 1, birthday),
	}, {
      where: {
        id: req.user.dataValues.id,
  	  }
	});
	if (hasImage && req.user.dataValues.image) {
      fs.unlinkSync(`uploads/${req.user.dataValues.image}`);
	}
	return res.redirect('/setprofile?message=saveSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.changepassword = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};

exports.findid = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};

exports.findpassword = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};

exports.setpassword = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};