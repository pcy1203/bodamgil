exports.renderMain = (req, res, next) => {
  res.render('paperplane/main');
};

exports.renderGlassBottle = (req, res, next) => {
  res.render('paperplane/glassbottle');
};

exports.renderPaperPlane = (req, res, next) => {
  // 본인의 것일 때만 볼 수 있도록 구현하기
  res.render('paperplane/paperplane');
};

exports.renderWrite = (req, res, next) => {
  res.render('paperplane/write');
};

exports.writePaperPlane = (req, res, next) => {
  next();  // 구현 예정
};