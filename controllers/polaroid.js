const Polaroid = require('../models/polaroid');

const isPolaroidOwner = async (userId, polaroidId) => {
  try {
	const polaroid = await Polaroid.findOne({ where: { id: polaroidId } });
    return {
	  isOwner: polaroid?.writer === userId,
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
	return res.redirect('/myself/polaroid?message=noPolaroid');
  }
  res.render('polaroid/view', { polaroids });
};

exports.renderPolaroid = async (req, res, next) => {
  const id = req.params.id;
  const polaroid = await Polaroid.findOne({
	where: { id },
  });
  if (!polaroid) {
	return res.redirect('/myself/polaroid?message=wrongAddressError');
  }
  res.render('polaroid/polaroid', { polaroid });
};

exports.renderWrite = (req, res, next) => {
  res.render('polaroid/write');
};

exports.renderSuccess = async (req, res, next) => {
  const id = req.params.id;
  const { isOwner, polaroid } = await isPolaroidOwner(req.user.dataValues.id, id);
  if (!polaroid || !isOwner) {
	return res.redirect('/myself/polaroid?message=wrongAddressError');
  }
  res.render('polaroid/success', { polaroid });
};

exports.writePolaroid = async (req, res, next) => {
  const { content, color, size } = req.body;
  if (!req.file) return res.redirect('/myself/polaroid/write?message=noPhotoError');
  if (content.length === 0) return res.redirect('/myself/polaroid/write?message=noDataError');
  if (content.length > 30) return res.redirect('/myself/polaroid/write?message=longDataError');
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

exports.deletePolaroid = async (req, res, next) => {
  try {
	const id = req.params.id;
    const { isOwner, polaroid } = await isPolaroidOwner(req.user.dataValues.id, id);
    if (isOwner && polaroid) {
	  await Polaroid.destroy({
	    where: { id },
	  });
	}
    return res.redirect(`/myself/polaroid/`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};