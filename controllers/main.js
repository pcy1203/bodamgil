exports.renderMain = (req, res, next) => {
  res.render('main/main');
};

exports.renderLogin = (req, res, next) => {
  let redirectURL = "/";
  if (req.session.redirectURL) {
	redirectURL = req.session.redirectURL;
  }
  res.render('main/login', { redirectURL:"/" });
};

exports.renderSignup = (req, res, next) => {
  res.render('main/signup');
};

exports.renderSignupSuccess = (req, res, next) => {
  res.render('main/signupsuccess');
};

exports.renderMyProfile = (req, res, next) => {
  res.render('main/myprofile');
};

exports.renderMyProfileLike = (req, res, next) => {
  res.render('main/myprofilelike');
};

exports.renderMyProfileGame = (req, res, next) => {
  res.render('main/myprofilegame');
};

exports.renderSetProfile = (req, res, next) => {
  res.render('main/setprofile');
};

exports.renderChangePassword = (req, res, next) => {
  res.render('main/changepassword');
};

exports.renderFindId = (req, res, next) => {
  res.render('main/findid');
};

exports.renderFindIdSuccess = (req, res, next) => {
  let name, email = '';
  if (req.session.findId) {
	name = req.session.findId.name;
	email = req.session.findId.email;
  }
  res.render('main/findidsuccess', { name, email });
};

exports.renderFindPassword = (req, res, next) => {
  res.render('main/findpassword');
};

exports.renderSetPassword = (req, res, next) => {
  res.render('main/setpassword');
};

exports.renderAbout = (req, res, next) => {
  res.render('main/about');
};

exports.renderNotice = (req, res, next) => {
  res.render('main/notice');
};

exports.renderFaq = (req, res, next) => {
  res.render('main/faq');
};