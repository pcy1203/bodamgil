const emailRegex = /^[\w\-\.]+\@[\w\-\.]+\.[\w\-\.]+$/;

const englishRegex = /[a-zA-Z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/;
const passwordRegex = {
  test: (password) => {
	return englishRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
  }
};

const telRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

const dateValidation = (year, month, day) => {
  let valid = true;
  year = Number(year);
  month = Number(month);
  day = Number(day);
  if (!year || !month || !day) valid = false;
  if (year <= 0 || month <= 0 || month > 12 || day <= 0 || day > 31) valid = false;
  if (day === 31 && [2, 4, 6, 9, 11].includes(month)) valid = false;
  if (day === 30 && month === 2) valid = false;
  if (day === 29 && month === 2 && (year % 100 === 0 || year % 4 !== 0)) valid = false;
  return valid;
};

exports.emailRegex = emailRegex;
exports.passwordRegex = passwordRegex;
exports.telRegex = telRegex;
exports.dateValidation = dateValidation;