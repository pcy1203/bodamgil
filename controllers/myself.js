const { gameList } = require('../models/initialdata');

exports.renderMain = (req, res, next) => {
  res.render('myself/main');
};

exports.renderGame = (req, res, next) => {
  res.render('myself/game', { gameList });
}