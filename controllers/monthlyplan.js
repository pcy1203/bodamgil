const { v4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/user');
// TO-DO
// const MonthlyPlan = require('../models/monthlyplan');

/* Need to check owner
const isMonthlyPlanOwner = async (userId, monthlyPlanId) => {
  try {
	const monthlyPlan = await MonthlyPlan.findOne({ where: { uuid: monthlyPlanId } });
    return {
	  isOwner: !userId ? false : monthlyPlan?.owner === userId,
	  monthlyPlan,
	};
  } catch (error) {
	throw error;
  }
}
*/

exports.renderMain = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/main');
};

exports.renderView = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/view');
};

exports.renderSelect = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/select');
};

exports.renderWrite = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/write');
};

exports.writeMonthlyPlan = (req, res, next) => {
  // TO-DO
  res.redirect('/');
};

exports.renderMonthlyPlan = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/monthlyplan');
};

exports.deleteMonthlyPlan = (req, res, next) => {
  // TO-DO
  res.redirect('/');
};

exports.renderPlanDetail = (req, res, next) => {
  // TO-DO
  res.render('monthlyplan/plandetail');
};

exports.updatePlanDetail = (req, res, next) => {
  // TO-DO
  res.redirect('/');
};