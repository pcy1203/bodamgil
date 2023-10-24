const changePolaroidColor = (color) => {
  switch (color) {
	case 'red':
	  document.querySelectorAll('.main').forEach((element) => {
		element.style.background = "#FFF3F3";
	  });
	  document.querySelectorAll('.sticker').forEach((element) => {
		element.style.background = "rgba(255, 189, 189, 0.8)";
	  });
	  break;
		  
	case 'yellow':
	  document.querySelectorAll('.main').forEach((element) => {
		element.style.background = "#FDF9E9";
	  });
	  document.querySelectorAll('.sticker').forEach((element) => {
		element.style.background = "rgba(246, 227, 146, 0.8)";
	  });
	  break;
		  
	case 'green':
	  document.querySelectorAll('.main').forEach((element) => {
		element.style.background = "#EEF8E4";
	  });
	  document.querySelectorAll('.sticker').forEach((element) => {
		element.style.background = "rgba(171, 220, 122, 0.8)";
	  });
	  break;
		  
	case 'blue':
	  document.querySelectorAll('.main').forEach((element) => {
		element.style.background = "#EBFAFF";
	  });
	  document.querySelectorAll('.sticker').forEach((element) => {
		element.style.background = "rgba(151, 228, 255, 0.8)";
	  });
	  break;
		  
	case 'purple':
	  document.querySelectorAll('.main').forEach((element) => {
		element.style.background = "#EFEDF7";
	  });
	  document.querySelectorAll('.sticker').forEach((element) => {
		element.style.background = "rgba(197, 187, 227, 0.8)";
	  });
	  break;
  }


	
}