const menuBlock = document.querySelector('.menu-container');
const menuBack = document.querySelector('.menu-back');

const navBar = document.querySelector('.navigationbar');

const mainBlock = document.querySelector('.main');
const blackBlock = document.querySelector('.black');

const resizePageHeight = () => {
  menuBlock.style.height = `${document.documentElement.scrollHeight}px`;
  menuBack.style.height = `${document.documentElement.scrollHeight}px`;
  if (mainBlock) mainBlock.style.height = `${document.documentElement.scrollHeight - navBar.scrollHeight - 8}px`;
  if (blackBlock) blackBlock.style.height = `${document.documentElement.scrollHeight}px`;
}

resizePageHeight();

window.addEventListener('resize', (e) => {
  resizePageHeight();
  if (window.innerWidth >= 1025) {
    menuBack.style.display = 'none';
    menuBlock.style.display = 'none';
  }
});
