const User = require('../models/user');
const PaperPlane = require('../models/paperplane');
const GlassBottle = require('../models/glassbottle');

const isGlassBottleOwner = async (userId, glassBottleId) => {
  try {
	const glassBottle = await GlassBottle.findOne({ where: { id: glassBottleId } });
    return glassBottle.owner === userId;
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
	const glassBottle = await GlassBottle.findOne({ where: { id } });
	const owner = await glassBottle.getUser();
    res.render('paperplane/glassbottle', {
	  id,
	  owner: owner.dataValues.name,
	});
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderPaperPlane = async (req, res, next) => {
  const id = req.params.id;
  try {
	if (!(await isGlassBottleOwner(req.user.dataValues.id, id))) {
	  return res.redirect(`/myself/paperplane/${id}?message=notOwnerError`);
    }
    const paperPlanes = await PaperPlane.findAll({
	  where: { recipient: id },
	  order: [[ 'createdAt', 'DESC' ]],
    });
    res.render('paperplane/paperplane', { paperPlanes });
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.renderWrite = async (req, res, next) => {
  const id = req.params.id;
  try {
	if (await isGlassBottleOwner(req.user.dataValues.id, id)) {
	  return res.redirect(`/myself/paperplane/${id}?message=ownerError`);
    }
    res.render('paperplane/write', { id });
  } catch (error) {
	console.error(error);
	return next(error);
  }
};

exports.writePaperPlane = async (req, res, next) => {
  const id = req.params.id;
  const { relationship, name, content } = req.body;
  try {
	if (isGlassBottleOwner(req.user.dataValues.id, id)) {
	  return res.redirect(`/myself/paperplane/${id}?message=ownerError`);
    }
	const paperplane = await PaperPlane.create({
	  relationship,
	  name,
	  content,
	  writer: req.user.dataValues.id,
	  recipient: id,
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