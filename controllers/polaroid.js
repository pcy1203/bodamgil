const Polaroid = require('../models/polaroid');

const isPolaroidOwner = async (userId, polaroidId) => {
  try {
	const polaroid = await Polaroid.findOne({ where: { id: polaroidId } });
    return {
	  isOwner: polaroid.writer === userId,
	  polaroid,
	};
  } catch (error) {
	throw error;
  }
};

exports.renderMain = (req, res, next) => {
  res.render('polaroid/main');
};

exports.renderPolaroids = async (req, res, next) => {
  const polaroids = await Polaroid.findAll({
	where: { writer: req.user.dataValues.id },
	order: [[ 'createdAt', 'DESC' ]],
  });
  if (polaroids.length === 0) {
	return res.redirect(`/myself/polaroid?message=noPolaroid`);
  }
  res.render('polaroid/view', { polaroids });
};

exports.renderPolaroid = async (req, res, next) => {
  const id = req.params.id;
  const polaroid = await Polaroid.findOne({
	where: { id },
  });
  res.render('polaroid/polaroid', { polaroid });
};

exports.renderWrite = (req, res, next) => {
  res.render('polaroid/write');
};

exports.renderSuccess = async (req, res, next) => {
  const id = req.params.id;
  const { isOwner, polaroid } = await isPolaroidOwner(req.user.dataValues.id, id);
  if (!isOwner) {
	return res.redirect(`/myself/polaroid/write?message=notOwnerError`);
  }
  res.render('polaroid/success', { polaroid });
};

exports.writePolaroid = async (req, res, next) => {
  // TODO - 유효성 검사 추가하기
  const { content, color, size } = req.body;
  try {
	const polaroid = await Polaroid.create({
	  image: `polaroid/${req.file.filename}`,
	  content,
	  color,
	  size,
	  writer: req.user.dataValues.id,
	});
    return res.redirect(`/myself/polaroid/${polaroid.id}/success`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};