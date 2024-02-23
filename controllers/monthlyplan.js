const { v4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/user');
const MonthlyPlan = require('../models/monthlyplan');
const PlanDetail = require('../models/plandetail');
const GameRecord = require('../models/gamerecord');

const getDefaultValue = () => {
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = today.getMonth() + 1;
  return { defaultYear, defaultMonth };
};

const isMonthlyPlanOwner = async (userId, monthlyPlanId) => {
  try {
	const monthlyPlan = await MonthlyPlan.findOne({ where: { uuid: monthlyPlanId } });
    return {
	  isOwner: !userId ? false : monthlyPlan?.writer === userId,
	  monthlyPlan,
	};
  } catch (error) {
	throw error;
  }
};

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
  const monthlyPlans = await MonthlyPlan.findAll({
	where: { writer: req.user.dataValues.id },
	order: [[ 'createdAt', 'DESC' ]],
  });
  res.render('monthlyplan/view', { monthlyPlans });
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
    contentAchievable, contentRelevant, contentTimelimited,
	detail1, detail2, detail3, detail4 } = req.body;
  const year = req.query?.year ? req.query?.year : getDefaultValue().defaultYear;
  const month = req.query?.month ? req.query?.month : getDefaultValue().defaultMonth;
  const contentLengthList = [content.length, contentSpecific.length, contentMeasurable.length,
	contentAchievable.length, contentRelevant.length, contentTimelimited.length];
  const maxContentLength = 500;  // Need to Modify
  const checkMaxLength = (length) => length <= maxContentLength;
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
	let week = 0;
	for await (let arr of [detail1, detail2, detail3, detail4]) {
	  week++;
	  for await (let detail of arr) {
		if (detail !== "") {
		  const planDetail = await PlanDetail.create({
			uuid: v4(),
			week,
			checked: false,
			content: detail,
		    plan: monthlyPlan.id,
		  });
		}
	  }
	};
	// await makeRecord(req.user.dataValues.id);
	return res.redirect(`/myself/monthlyplan/view`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderMonthlyPlan = (req, res, next) => {
  res.render('monthlyplan/monthlyplan');
  /*
  const id = req.params.id;
  const { isOwner, monthlyPlan } = await isMonthlyPlanOwner(req.user.dataValues.id, id);
  if (!monthlyPlan || !isOwner) {
	return res.redirect('/myself/monthlyplan?message=wrongAddressError');
  }
  res.render('monthlyplan/monthlyplan', { monthlyPlan });
  */
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