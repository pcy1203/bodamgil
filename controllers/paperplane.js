const User = require('../models/user');
const PaperPlane = require('../models/paperplane');
const GlassBottle = require('../models/glassbottle');

const isGlassBottleOwner = async (userId, glassBottleId) => {
  try {
	const glassBottle = await GlassBottle.findOne({ where: { id: glassBottleId } });
    return {
	  isOwner: glassBottle.owner === userId,
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
	    owner: req.user.dataValues.id
	  });
    }
    return res.redirect(`/myself/paperplane/${glassBottle.id}`);
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderGlassBottle = async (req, res, next) => {
  const id = req.params.id;
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
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
	const { isOwner } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (!isOwner) {
	  return res.redirect(`/myself/paperplane/${id}?message=notOwnerError`);
    }
    const paperPlanes = await PaperPlane.findAll({
	  where: { recipient: id },
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
	if (isOwner) {
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
  try {
	const { isOwner, glassBottle } = await isGlassBottleOwner(req.user.dataValues.id, id);
	if (isOwner) {
	  return res.redirect(`/myself/paperplane/${id}?message=ownerError`);
    }
	const paperplane = await PaperPlane.create({
	  relationship,
	  name,
	  content,
	  writer: req.user.dataValues.id,
	  recipient: id,
	});
	glassBottle.increment({ numPaperPlane: 1 });
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