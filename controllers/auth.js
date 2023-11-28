const bcrypt = require('bcrypt');
const passport = require('passport');
const fs = require('fs');
const { v4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Polaroid = require('../models/polaroid');
const GlassBottle = require('../models/glassbottle');
const GameRecord = require('../models/gamerecord');
const PaperPlane = require('../models/paperplane');
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
	  } else if (req.user.redirectURL) {
		const redirectURL = req.user.redirectURL;
		req.user.redirectURL = null;
	    return res.redirect(redirectURL);
	  } else {
	    return res.redirect("/");
      }
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
	  email: sanitizeHtml(email),
	  password: hashedPassword,
	  name: sanitizeHtml(name),
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
	  name: sanitizeHtml(name),
	  introduction: sanitizeHtml(introduction),
	  image: hasImage ? `/profile/${req.file.filename}` : req.user.dataValues.image,
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
	if (req.session.redirectURL) {
	  const redirectURL = req.session.redirectURL;
	  req.session.redirectURL = null;
	  return res.redirect(`${redirectURL}?message=signupSuccess`);
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

exports.findpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
	const exUser = await User.findOne({ where: { email }});
	if (!exUser) return res.redirect('/findpassword?message=noUserError');
	const setPasswordUuid = v4();
	await User.update({
	  setPasswordUuid,
	  setPasswordDate: new Date(),
	}, {
      where: { email }
	});
	const setPasswordUrl = req.headers.referer.split("?")[0].slice(0, -13);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_ID,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_ID,
      to: email,
      subject: '[보담길] 비밀번호 재설정 안내',
      html: `
        <div>
          아래 링크를 눌러 비밀번호를 재설정해주세요.<br>링크는 24시간 동안만 유효합니다.<br>
          <a href=${setPasswordUrl}/setpassword/${setPasswordUuid}>비밀번호 재설정하기</a>
        </div>`,
      text: "인증 메일입니다.",
    });
    return res.redirect('/login?message=mailSendSuccess');  
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.setpassword = async (req, res, next) => {
  const { password, confirm, id } = req.body;
  if (password.length < 8 || password.length > 20 || !(passwordRegex.test(password))) return res.redirect(`/setpassword/${id}?message=passwordError`);
  if (password !== confirm) return res.redirect(`/setpassword/${id}?message=passwordConfirmError`);
  try {
	const user = await User.findOne({ where: { setPasswordUuid: id } });
	const isValid = user?.setPasswordDate.getTime() - (new Date()).getTime() <= 86400000;
	if (!user || !isValid) {
		console.log(id, user, isValid);
	  return res.redirect('/?message=invalidRequestError');
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	await User.update({
	  password: hashedPassword,
	  setPasswordUuid: null,
	}, {
      where: {
        setPasswordUuid: id,
  	  }
	});
	return res.redirect('/login?message=setPasswordSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  } 
};

exports.unregister = async (req, res, next) => {
  try {
	if (!req.headers.referer?.includes("myprofile")) {
	  return res.redirect('/?message=invalidRequestError');
	}
	/*
	const unknownUser = await User.findOne({ where: { email: "unknown" }});
    await PaperPlane.update({
	  writer: unknownUser.id,
	}, {
      where: {
        writer: req.user.dataValues.id,
  	  }
	});
	*/
	const polaroids = await Polaroid.findAll({
	  where: { writer: req.user.dataValues.id },
    });
    for (let polaroid of polaroids) {
	  fs.unlinkSync(`uploads/${polaroid.image}`);
	}/*
	await Polaroid.destroy({
      where: { writer: req.user.dataValues.id },
	});*/
	await GlassBottle.destroy({
      where: { owner: req.user.dataValues.id },
	});
	await GameRecord.destroy({
      where: { user: req.user.dataValues.id },
	});
    if (req.user.dataValues.image) {
      fs.unlinkSync(`uploads/${req.user.dataValues.image}`);	
	}
	await User.destroy({
      where: { id: req.user.dataValues.id },
	});
	return res.redirect('/?message=unregisterSuccess');
  } catch (error) {
	console.error(error);
	return next(error);
  }
};