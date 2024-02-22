const { v4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/user');
const MonthlyPlan = require('../models/monthlyplan');
const GameRecord = require('../models/gamerecord');

const getDefaultValue = () => {
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;
  return { defaultYear, defaultMonth };
};

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

/* Neet to make game record
const makeRecord = async (userId) => {
  try {
	const exRecord = await GameRecord.findOne({ where: {
	  user: userId,
	  game: 'monthlyplan',
	}});
	if (exRecord) {
	  await exRecord.update({ completedAt: new Date() });
	} else {
	  await GameRecord.create({
	    user: userId,
		game: 'monthlyplan',
		completedAt: new Date(),
	  });
	}
  } catch (error) {
	throw error;
  }
};
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
  const { defaultYear, defaultMonth } = getDefaultValue();
  res.render('monthlyplan/select', { defaultYear, defaultMonth });
};

exports.renderWrite = (req, res, next) => {
  if (!req.query?.year || !req.query?.month) {
    const { defaultYear, defaultMonth } = getDefaultValue();
	return res.redirect(`/myself/monthlyplan/write?year=${defaultYear}&month=${defaultMonth}`);
  }
  res.render('monthlyplan/write');
};

exports.writeMonthlyPlan = async (req, res, next) => {
  const { name, content, contentSpecific, contentMeasurable,
    contentAchievable, contentRelevant, contentTimelimited } = req.body;
  const year = req.query?.year ? req.query?.year : getDefaultValue().defaultYear;
  const month = req.query?.month ? req.query?.month : getDefaultValue().defaultMonth;
  const contentLengthList = [content.length, contentSpecific.length, contentMeasurable.length,
	contentAchievable.length, contentRelevant.length, contentTimelimited.length];
  const maxContentLength = 500;  // Need to Modify
  const checkMaxLength = (length) => length <= maxContentLength;
	console.log(req.file);
  if (!req.file) return res.redirect(`/myself/monthlyplan/write?year=${year}&month=${month}&message=noPhotoError`);
  if (name.length === 0 || contentLengthList.includes(0)) return res.redirect(`/myself/monthlyplan/write?year=${year}&month=${month}&message=noDataError`);	
  if (name.length > 20 || contentLengthList.filter(checkMaxLength).length === 0) return res.redirect(`/myself/monthlyplan/write?year=${year}&month=${month}&message=longDataError`);
  try {
	const monthlyPlan = await MonthlyPlan.create({
	  uuid: v4(),
	  year,
	  month,
	  image: `/monthlyplan/${req.file.filename}`,
	  name,
	  content,
	  contentSpecific,
	  contentMeasurable,
	  contentAchievable,
	  contentRelevant,
	  contentTimelimited,
	  writer: req.user.dataValues.id,
	});
	// await makeRecord(req.user.dataValues.id);
	return res.redirect(`/myself/monthlyplan/view`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
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