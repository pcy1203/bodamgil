const changePolaroidSize = (size) => {
  switch (size) {
	case 'horizontal':
	  document.querySelectorAll('.polaroid').forEach((element) => {
		element.style.height = "227px";
	  });
	  document.querySelectorAll('.photo').forEach((element) => {
		element.style.height = "151px";
	  });
	  break;
		  
	case 'vertical':
	  document.querySelectorAll('.polaroid').forEach((element) => {
		element.style.height = "334px";
	  });
	  document.querySelectorAll('.photo').forEach((element) => {
		element.style.height = "260px";
	  });
	  break;
  }
};