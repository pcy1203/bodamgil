const numContents = Number(document.querySelector('.name3').innerHTML);
const startPageNumber = (numContents !== 0 ? 1 : 0);
let page = startPageNumber;
const changePage = (currentPage) => {
  for (let i = 1; i <= numContents; i++) {
	if (i !== currentPage) {
	  document.querySelector(`.contents-${i}`).style.display = 'none';
	} else {
	  document.querySelector(`.contents-${i}`).style.display = 'block';
	}
  }
  document.querySelector('.back').style.display = (currentPage === startPageNumber ? 'none' : 'block');
  document.querySelector('.next').style.display = (currentPage === numContents ? 'none' : 'block');
  document.querySelector('.name1').innerHTML = currentPage;
};
changePage(page);

document.querySelectorAll('.back').forEach((button) => {
  button.addEventListener('click', () => {
	page--;
	changePage(page);
  });
});

document.querySelectorAll('.next').forEach((button) => {
  button.addEventListener('click', () => {
	page++;
	changePage(page);
  });
});