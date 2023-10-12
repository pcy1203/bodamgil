const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

const passport = require('passport');

dotenv.config();
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const mainRouter = require('./routes/main');
const authRouter = require('./routes/auth');

const app = express();
passportConfig();

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false })
  .then(() => {
	console.log('데이터베이스 연결 성공!')
  })
  .catch((err) => {
	console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO - 파일 경로 설정하기
app.use('/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
	httpOnly: true,
	secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', mainRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {  // 404 응답 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {  // 에러 처리 미들웨어
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중...');
});