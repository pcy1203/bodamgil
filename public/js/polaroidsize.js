const changePolaroidSize = (size) => {
  switch (size) {
	case 'horizontal':
	  document.querySelectorAll('.polaroid').forEach((element) => {
		element.style.height = "227px";
	  });
	  document.querySelectorAll('.photo').forEach((element) => {
		element.style.height = "151px";
	  });
	  document.querySelectorAll('.size-vertical').forEach((element) => {
		element.classList.remove('size-vertical');
		element.classList.add('size-horizontal');
	  });
	  break;
		  
	case 'vertical':
	  document.querySelectorAll('.polaroid').forEach((element) => {
		element.style.height = "334px";
	  });
	  document.querySelectorAll('.photo').forEach((element) => {
		element.style.height = "260px";
	  });
	  document.querySelectorAll('.size-horizontal').forEach((element) => {
		element.classList.remove('size-horizontal');
		element.classList.add('size-vertical');
	  });
	  break;
  }
};