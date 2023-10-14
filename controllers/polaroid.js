exports.renderMain = (req, res, next) => {
  res.render('polaroid/main');
};

exports.renderPolaroid = (req, res, next) => {
  res.render('polaroid/view');
};

exports.renderWrite = (req, res, next) => {
  res.render('polaroid/write');
};

exports.writePolaroid = (req, res, next) => {
  next();  // 구현 예정
};