exports.renderMain = (req, res, next) => {
  res.render('main/main');
};

exports.renderLogin = (req, res, next) => {
  let redirectURL = "/";
  if (req.session.redirectURL) {
	redirectURL = req.session.redirectURL;
	req.session.redirectURL = null;
  }
  res.render('main/login', { redirectURL });
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
  res.render('main/findidsuccess');
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