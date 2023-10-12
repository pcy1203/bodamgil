exports.renderMain = (req, res, next) => {
  res.render('main');
};

exports.renderLogin = (req, res, next) => {
  res.render('login');
};

exports.renderSignup = (req, res, next) => {
  res.render('signup');
};

exports.renderMyProfile = (req, res, next) => {
  res.render('myprofile');
};

exports.renderSetProfile = (req, res, next) => {
  res.render('setprofile');
};

exports.renderChangePassword = (req, res, next) => {
  res.render('changepassword');
};

exports.renderAbout = (req, res, next) => {
  res.render('about');
};