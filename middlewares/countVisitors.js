const Counter = require('../models/counter');

exports.countVisitors = async (req, res, next) => {
  req.session.bodamgil = true;
  let connectSid = req.headers.cookie?.split("; ").filter((value) => value.includes("connect.sid"))[0]?.split("=")[1];

  if (connectSid && !req.cookies.count) {
	res.cookie('count', 'count', { maxAge: 3600000, httpOnly: true });
	let now = new Date();
	now.setHours(now.getHours() + 9);
	let date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
	  
	try {
	  let totalCounter = await Counter.findOne({ where: { date: 'total' }});
	  if (!totalCounter) {
		totalCounter = await Counter.create({
		  date: 'total',
		  count: 0,
		});
	  }
	  await totalCounter.increment({ count: 1 });
	  let todayCounter = await Counter.findOne({ where: { date }});
	  if (!todayCounter) {
		todayCounter = await Counter.create({
		  date,
		  count: 0,
		});
	  }  
	  await todayCounter.increment({ count: 1 });
	} catch (error) {
	  console.error(error);
	  return next(error);
	}
  }
  next();
}