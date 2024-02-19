const { v4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/user');
const MonthlyPlan = require('../models/monthlyplan');

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
  res.render('monthlyplan/main');
};

exports.renderView = async (req, res, next) => {
  const monthlyplans = await MonthlyPlan.findAll({
	where: { writer: req.user.dataValues.id },
	order: [[ 'createdAt', 'DESC' ]],
  });
  res.render('monthlyplan/view', { monthlyplans });
};

exports.renderSelect = (req, res, next) => {
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1
  res.render('monthlyplan/select', { defaultYear, defaultMonth });
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