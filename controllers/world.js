exports.renderMain = (req, res, next) => {
  res.render('world/main');
};

exports.renderDuty = (req, res, next) => {
  res.render('world/duty');
};

exports.renderJob = (req, res, next) => {
  res.render('world/job');
};

exports.renderSite = (req, res, next) => {
  res.render('world/site');
};