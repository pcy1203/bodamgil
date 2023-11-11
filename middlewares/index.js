exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
	next();
  } else {
	res.locals.redirectURL = req.originalUrl;
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