const bcrypt = require('bcrypt');
const passport = require('passport');
const fs = require('fs');
const User = require('../models/user');
const { emailRegex, passwordRegex, telRegex, dateValidation } = require('../public/js/uservalidation');

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
  const { email, password, confirm, name, tel, gender,
		 birthyear, birthmonth, birthday } = req.body;
  if (email.length > 40 || !(emailRegex.test(email))) return res.redirect('/signup?message=emailError');
  if (password.length < 8 || password.length > 20 || !(passwordRegex.test(password))) return res.redirect('/signup?message=passwordError');
  if (password !== confirm) return res.redirect('/signup?message=passwordConfirmError');
  if (tel.length > 13 || !(telRegex.test(tel))) return res.redirect('/signup?message=telError');
  if (!name || name.length > 20) return res.redirect('/signup?message=nameError');
  if (!birthyear || !birthmonth || !birthday || !dateValidation(birthyear, birthmonth, birthday)) return res.redirect('/signup?message=birthError');
  try {
	const exUser = await User.findOne({ where: { email } });
	if (exUser) {
	  return res.redirect('/signup?message=existUserError');
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	const sameTelUser = await User.findOne({ where: { tel } });
	if (sameTelUser) {
	  return res.redirect('/signup?message=existSameTelError');
	}
	const newUser = await User.create({
	  email,
	  password: hashedPassword,
	  name,
	  tel,
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
  const { name, introduction, gender, birthyear, birthmonth, birthday } = req.body;
  if (!name || name.length > 20) return res.redirect('/setprofile?message=nameError');
  if (!gender) return res.redirect('/setprofile?message=genderError');
  if (!birthyear || !birthmonth || !birthday || !dateValidation(birthyear, birthmonth, birthday)) return res.redirect('/setprofile?message=birthError');
  const hasImage = req.file?.filename !== undefined;
  try {
	await User.update({
	  name,
	  introduction,
	  image: hasImage ? `profile/${req.file.filename}` : req.user.dataValues.image,
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
	return res.redirect('/myprofile?message=saveSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.changepassword = async (req, res, next) => {
  const { currentpassword, password, confirm } = req.body;
  if (password.length < 8 || password.length > 20 || !(passwordRegex.test(password))) return res.redirect('/changepassword?message=passwordError');
  if (password !== confirm) return res.redirect('/changepassword?message=passwordConfirmError');
  try {
	const user = await User.findOne({ where: { id: req.user.dataValues.id } });
	if (user && !(await bcrypt.compare(currentpassword, user.password))) {
	  return res.redirect('/changepassword?message=currentPasswordError');
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	await User.update({
	  password: hashedPassword,
	}, {
      where: {
        id: req.user.dataValues.id,
  	  }
	});
	return res.redirect('/myprofile?message=changeSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  } 
};

exports.findid = async (req, res, next) => {
  const { tel } = req.body;
  if (tel.length > 13 || !(telRegex.test(tel))) return res.redirect('/findid?message=telError');
  try {
	const user = await User.findOne({ where: { tel } });
	if (!user) return res.redirect('/findid?message=notExistError');
    req.session.findId = {
	  name: user.name,
	  email: user.email,
	};
    return res.redirect('/findid/success');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.findpassword = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};

exports.setpassword = (req, res, next) => {
  return res.redirect('/');  // TO-DO
};