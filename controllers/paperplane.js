const PaperPlane = require('../models/paperplane');
const GlassBottle = require('../models/glassbottle');

exports.renderMain = (req, res, next) => {
  res.render('paperplane/main');
};

exports.renderGlassBottle = (req, res, next) => {
  const id = req.params.id;
  res.render('paperplane/glassbottle', { id });
};

exports.renderPaperPlane = (req, res, next) => {
  // 본인의 것일 때만 볼 수 있도록 구현하기
  res.render('paperplane/paperplane');
};

exports.renderWrite = (req, res, next) => {
  const id = req.params.id;
  res.render('paperplane/write', { id });
};

exports.writePaperPlane = async (req, res, next) => {
  const { relationship, name, content } = req.body;
  try {
	const paperplane = await PaperPlane.create({
	  relationship,
	  name,
	  content,
	  writer: req.user.dataValues.id,
	  recipient: req.params.id,
	});
    return res.redirect(`/myself/paperplane/success`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.makeGlassBottleIfNotExist = async (req, res, next) => {
  let glassBottle = await GlassBottle.findOne({ where: { owner: req.user.dataValues.id } });
  if (!glassBottle) {
	glassBottle = await GlassBottle.create({
	  owner: req.user.dataValues.id
	});
  }
  return res.redirect(`/myself/paperplane/${glassBottle.id}`);
};