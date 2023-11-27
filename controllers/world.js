exports.renderMain = (req, res, next) => {
  res.render('world/main');
};

exports.renderDuty = (req, res, next) => {
  res.redirect('/world?message=preparation');
  // res.render('world/duty');
};

exports.renderJob = (req, res, next) => {
  res.render('world/job', { jobList: global.jobList });
};

exports.renderSite = (req, res, next) => {
  res.render('world/site');
};