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
const { initializeGameDB } = require('./models/initialdata');
const { getCareerNetJobData } = require('./dataRequest');
const redis = require('redis');
const RedisStore = require('connect-redis').default;

const passportConfig = require('./passport');
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');

const mainRouter = require('./routes/main');
const authRouter = require('./routes/auth');
const myselfRouter = require('./routes/myself');
const worldRouter = require('./routes/world');

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
	console.log('데이터베이스 연결 성공!');
    initializeGameDB();
  })
  .catch((err) => {
	console.error(err);
  });

try {
  (async () => {
    global.jobList = await getCareerNetJobData();
  })();
} catch (error) {
  console.log(error);
}

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  legacyMode: false,
});
redisClient.connect().catch(console.error);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({
	contentSecurityPolicy: false,
	crossOriginEmbedderPolicy: false,
	crossOriginResourcePolicy: false,
  }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/photo', express.static(path.join(__dirname, 'photo')));
app.use('/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/polaroid', express.static(path.join(__dirname, 'uploads/polaroid')));

app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
	httpOnly: true,
	secure: false,
  },
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/myself', myselfRouter);
app.use('/world', worldRouter);

app.use((req, res, next) => {  // 404 응답 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {  // 에러 처리 미들웨어
  logger.error(error.message);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;