const { v4 } = require('uuid');
const User = require('../models/user');
const PaperPlane = require('../models/paperplane');
const GlassBottle = require('../models/glassbottle');
const GameRecord = require('../models/gamerecord');

const isGlassBottleOwner = async (userId, glassBottleId) => {
  try {
	const glassBottle = await GlassBottle.findOne({ where: { uuid: glassBottleId } });
    return {
	  isOwner: glassBottle?.owner === userId,
	  glassBottle,
	};
  } catch (error) {
	throw error;
  }
}

exports.renderMain = (req, res, next) => {
  res.render('paperplane/main');
};

exports.makeGlassBottleIfNotExist = async (req, res, next) => {
  try {  
    let glassBottle = await GlassBottle.findOne({ where: { owner: req.user.dataValues.id } });
    if (!glassBottle) {
	  glassBottle = await GlassBottle.create({
		uuid: v4(),
	    owner: req.user.dataValues.id,
	  });
	  await GameRecord.create({
	    user: req.user.dataValues.id,
		game: 'paperplane',
		completedAt: new Date(),
	  });
    }
    return res.redirect(`/myself/paperplane/${glassBottle.uuid}`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderGlassBottle = async (req, res, next) => {
  const id = req.params.id;
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (!glassBottle) {
	  return res.redirect('/myself/paperplane?message=wrongAddressError');
	}
	const owner = await glassBottle.getUser();
    res.render('paperplane/glassbottle', {
	  id,
	  isOwner,
	  owner: owner.dataValues.name,
	  numPaperPlane: glassBottle.numPaperPlane,
	});
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderPaperPlane = async (req, res, next) => {
  const id = req.params.id;
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (!glassBottle) {
	  return res.redirect('/myself/paperplane?message=wrongAddressError');
	} else if (!isOwner) {
	  return res.redirect(`/myself/paperplane/${id}?message=notOwnerError`);
    }
    const paperPlanes = await PaperPlane.findAll({
	  where: { recipient: glassBottle.id },
	  order: [[ 'createdAt', 'DESC' ]],
    });
	if (paperPlanes.length === 0) {
	  return res.redirect(`/myself/paperplane/${id}?message=noPaperPlane`);
	}
    res.render('paperplane/paperplane', { paperPlanes });
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderWrite = async (req, res, next) => {
  const id = req.params.id;
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (!glassBottle) {
	  return res.redirect('/myself/paperplane?message=wrongAddressError');
	} else if (isOwner) {
	  return res.redirect(`/myself/paperplane/${id}?message=ownerError`);
    }
	const owner = await glassBottle.getUser();  
    res.render('paperplane/write', {
	  id,
	  owner: owner.dataValues.name,
	});
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.writePaperPlane = async (req, res, next) => {
  const id = req.params.id;
  const { relationship, name, content } = req.body;
  if (name.length === 0 || content.length === 0) return res.redirect(`/myself/paperplane/${id}/write?message=noDataError`);
  if (name.length > 14 || content.length > 437) return res.redirect(`/myself/paperplane/${id}/write?message=longDataError`);
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (!glassBottle) {
	  return res.redirect('/myself/paperplane?message=wrongAddressError');
	} else if (isOwner) {
	  return res.redirect(`/myself/paperplane/${id}?message=ownerError`);
    }
	const paperplane = await PaperPlane.create({
	  relationship,
	  name,
	  content,
	  writer: req.user.dataValues.id,
	  recipient: glassBottle.id,
	});
	await glassBottle.increment({ numPaperPlane: 1 });
	await GameRecord.update({
	  completedAt: new Date()
	}, {
	  where: {
	    user: glassBottle.owner,
		game: 'paperplane',
	  }
	});
    return res.redirect(`/myself/paperplane/${id}/write/success`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderSuccess = (req, res, next) => {
  const id = req.params.id;
  res.render('paperplane/success', { id });
};