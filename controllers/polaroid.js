const Polaroid = require('../models/polaroid');

exports.renderMain = (req, res, next) => {
  res.render('polaroid/main');
};

exports.renderPolaroid = (req, res, next) => {
  res.render('polaroid/view');
};

exports.renderWrite = (req, res, next) => {
  res.render('polaroid/write');
};

exports.writePolaroid = async (req, res, next) => {
  // TODO - 유효성 검사 추가하기
  const { content } = req.body;
  try {
	const polaroid = await Polaroid.create({
	  image: `polaroid/${req.file.filename}`,
	  content,
	  writer: req.user.dataValues.id,
	})
    return res.redirect(`/myself/polaroid/${polaroid.id}`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};