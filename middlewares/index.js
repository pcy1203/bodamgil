exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
	next();
  } else {
	res.status(403).send('로그인 후 사용해주세요!');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
	next();
  } else {
	res.redirect('/');
  }
}