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

exports.renderAbout = (req, res, next) => {
  res.render('main/about');
};