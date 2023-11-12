const fs = require('fs');
const Polaroid = require('../models/polaroid');
const GameRecord = require('../models/gamerecord');

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

const makeRecord = async (userId) => {
  try {
	const exRecord = await GameRecord.findOne({ where: {
	  user: userId,
	  game: 'polaroid',
	}});
	if (exRecord) {
	  await exRecord.update({ completedAt: new Date() });
	} else {
	  await GameRecord.create({
	    user: userId,
		game: 'polaroid',
		completedAt: new Date(),
	  });
	}
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
	await makeRecord(req.user.dataValues.id);
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
      fs.unlinkSync(`uploads/${polaroid.image}`);
	  await Polaroid.destroy({
	    where: { id },
	  });
	  const exPolaroid = await Polaroid.findOne({ where: { writer: req.user.dataValues.id } });
	  if (!exPolaroid) {
		await GameRecord.destroy({ where: {
		  user: req.user.dataValues.id,
		  game: 'polaroid',
		}});
	  } else {
		await GameRecord.update({
			completedAt: new Date()
		}, {
		  where: {
		    user: req.user.dataValues.id,
		    game: 'polaroid',
		  }
		});
	  }
	}
    return res.redirect(`/myself/polaroid/`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};