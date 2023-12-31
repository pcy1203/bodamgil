const { gameList } = require('../models/initialdata');
const GameRecord = require('../models/gamerecord');
// const Counter = require('../models/counter');

const setRedirectURL = (req) => {
  const originalUrl = req.headers.referer;
  const maintainUrl = ["login", "signup", "setprofile", "findid", "findpassword", "kakao", "google"]
    .filter((word) => originalUrl?.includes(word)).length !== 0;
  const invalidUrl = ["logout", "unregister"]
    .filter((word) => originalUrl?.includes(word)).length !== 0;
  if (req.session.redirectToLogin) {
	req.session.redirectToLogin = false;  // redirected to login page
  } else if (!maintainUrl || invalidUrl) {
	req.session.redirectURL = null;  // redirect to "/" (initialize)
  }
};

exports.renderMain = async (req, res, next) => {
  // let now = new Date();
  // now.setHours(now.getHours() + 9);
  // let date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  // const todayVisitors = (await Counter.findOne({ where: { date }}))?.count;
  // const totalVisitors = (await Counter.findOne({ where: { date: 'total' }}))?.count;
  // res.render('main/main', { gameList, todayVisitors, totalVisitors });
  res.render('main/main', { gameList });
};

exports.renderLogin = (req, res, next) => {
  setRedirectURL(req);
  res.render('main/login');
};

exports.renderSignup = (req, res, next) => {
  setRedirectURL(req);
  res.render('main/signup');
};

exports.renderSignupSuccess = (req, res, next) => {
  setRedirectURL(req);
  res.render('main/signupsuccess');
};

exports.renderMyProfile = (req, res, next) => {
  res.render('main/myprofile');
};

exports.renderMyProfileNote = (req, res, next) => {
  res.redirect('/myprofile?message=preparation');
};

exports.renderMyProfileLike = (req, res, next) => {
  res.redirect('/myprofile?message=preparation')
  // res.render('main/myprofilelike');
};

exports.renderMyProfileGame = async (req, res, next) => {
  try {
    const gameRecords = await GameRecord.findAll({
	  where: { user: req.user.dataValues.id },
	  order: [[ 'completedAt', 'DESC' ]],
    });
	const records = [];
	for await (let gameRecord of gameRecords) {
	  let game = await gameRecord.getGame();
	  let time = new Date(gameRecord.completedAt);
	  time.setHours(time.getHours() + 9);
	  records.push({
		url: `/myself/${game.dataValues.name}`,
		title: game.dataValues.title,
		introduction: game.dataValues.introduction,
		image: game.dataValues.image,
		completedAt: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`,
	  });
	}
    res.render('main/myprofilegame', { records });
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderSetProfile = (req, res, next) => {
  res.render('main/setprofile');
};

exports.renderChangePassword = (req, res, next) => {
  res.render('main/changepassword');
};

exports.renderFindId = (req, res, next) => {
  setRedirectURL(req);
  res.render('main/findid');
};

exports.renderFindIdSuccess = (req, res, next) => {
  setRedirectURL(req);
  let name, email = '';
  if (req.session.findId) {
	name = req.session.findId.name;
	email = req.session.findId.email;
  }
  res.render('main/findidsuccess', { name, email });
};

exports.renderFindPassword = (req, res, next) => {
  setRedirectURL(req);
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