// Validation Check
document.querySelector('input#email')?.addEventListener('input', (e) => {
  if (e.target.value && (e.target.value.length > 40 || !emailRegex.test(e.target.value))) {
    e.target.classList.add("invalid");
  } else {
    e.target.classList.remove("invalid");
  }
});

document.querySelector('input#password')?.addEventListener('input', (e) => {
  if (e.target.value && (e.target.value.length < 8 || e.target.value.length > 20 || !passwordRegex.test(e.target.value))) {
    e.target.classList.add("invalid");
  } else {
    e.target.classList.remove("invalid");
  }
});

document.querySelector('input#confirm')?.addEventListener('input', (e) => {
  if (e.target.value && e.target.value !== document.querySelector('input#password').value) {
    e.target.classList.add("invalid");
  } else {
    e.target.classList.remove("invalid");
  }
});

document.querySelector('input#name')?.addEventListener('input', (e) => {
  if (e.target.value && e.target.value.length > 20) {
    e.target.classList.add("invalid");
  } else {
    e.target.classList.remove("invalid");
  }
});

document.querySelector('input#tel')?.addEventListener('input', (e) => {
  if (e.target.value && (e.target.value.length > 13 || !telRegex.test(e.target.value))) {
    e.target.classList.add("invalid");
  } else {
    e.target.classList.remove("invalid");
  }
});

const birthSelects = document.querySelectorAll('.birth select');
const birthyear = document.querySelector('select#birthyear');
const birthmonth = document.querySelector('select#birthmonth');
const birthday = document.querySelector('select#birthday');

birthSelects?.forEach((select) => {
  select.addEventListener('input', (e) => {
    if (birthyear.value !== '년도' && birthmonth.value !== '월' && birthday.value !== '일'
		&& !dateValidation(birthyear.value, birthmonth.value, birthday.value)) {
      birthSelects.forEach((select) => {
		select.classList.add("invalid");
	  });
    } else {
	  birthSelects.forEach((select) => {
		select.classList.remove("invalid");
	  });
    }
  });
});