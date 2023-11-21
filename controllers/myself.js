const { gameList } = require('../models/initialdata');

exports.renderMain = (req, res, next) => {
  res.render('myself/main');
};

exports.renderGame = (req, res, next) => {
  res.render('myself/game', { gameList });
};

exports.renderTest = (req, res, next) => {
  res.render('myself/test');
};