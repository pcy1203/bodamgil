exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
	next();
  } else {
	req.session.redirectURL = req.originalUrl;
	req.session.redirectToLogin = true;
	res.redirect('/login');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
	next();
  } else {
	res.redirect('/');
  }
}