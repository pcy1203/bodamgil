// const User = require('../models/user');
const Game = require('../models/game');

const gameList = [
  {
	"name": "polaroid",
	"title": "어릴 때의 내가 좋아했던 것은?",
	"introduction": "꿈이 많고 마냥 즐거웠던 어렸을 때의 꿈, 좋아했던 것, 인상깊었던 경험 등을 떠올려보면서 나라는 사람이 어떤 것을 좋아하는 사람이었는지 생각해보는 시간을 가질 수 있어요.",
	"image": "/photo/polaroid/polaroid_main.png",
  },
  {
	"name": "paperplane",
	"title": "내가 잘하는 것은? 네가 잘하는 것은!",
	"introduction": "때로는 자신이 잘하는 것을 자신이 발견하기는 어렵기도 하죠. 자신의 주변 사람들에게 물어보면서 자신이 무엇을 잘하는 사람인지 탐구해봐요.",
	"image": "/photo/paperplane/paperplane_main.png",
  },
];
/*
// Unknown User for Replacing Deleted Users
exports.makeUnknownUser = async () => {
  try {
    const exUser = await User.findOne({ where: { email: "unknown" }});
	  if (!exUser) {
	    await User.create({
		  email: "unknown",
		  name: "unknown",
	    });
	  } 
  } catch (error) {
    console.error(error);
  }
};
*/
exports.initializeGameDB = async () => {
  try {
    gameList.forEach(async (game) => {
	  const exGame = await Game.findOne({ where: { name: game.name }});
	  if (exGame) {
	    await Game.update({
		  name: game.name,
		  title: game.title,
		  introduction: game.introduction,
		  image: game.image,
	    }, {
		  where: { name: game.name },
	    });
	  } else {
	    await Game.create({
		  name: game.name,
		  title: game.title,
		  introduction: game.introduction,
		  image: game.image,
	    });
	  } 
    });
  } catch (error) {
    console.error(error);
  }
};