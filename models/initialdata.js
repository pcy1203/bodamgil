// const User = require('../models/user');
const Game = require('../models/game');

const gameList = [
  {
	"name": "polaroid",
	"category": "흥미",
	"title": "어릴 때의 내가 좋아했던 것은?",
	"introduction": "꿈이 많고 마냥 즐거웠던 어렸을 때의 꿈, 좋아했던 것, 인상깊었던 경험 등을 떠올려보면서 나라는 사람이 어떤 것을 좋아하는 사람이었는지 생각해보는 시간을 가질 수 있어요.",
	"image": "/photo/polaroid/polaroid_main.png",
  },
  {
	"name": "paperplane",
	"category": "능력",
	"title": "내가 잘하는 것은? 네가 잘하는 것은!",
	"introduction": "때로는 자신이 잘하는 것을 자신이 발견하기는 어렵기도 하죠. 자신의 주변 사람들에게 물어보면서 자신이 무엇을 잘하는 사람인지 탐구해봐요.",
	"image": "/photo/paperplane/paperplane_main.png",
  },
  {
	"name": "monthlyplan",
	"category": "목표",
	"title": "나만의 이번 달 컨셉과 목표 세우기",
	"introduction": "목표를 정해 내가 향할 목적지를 미리 설정해두며 실행력을 높일 수 있어요. 작심삼일이 아닌 꾸준히 이룰 수 있게 하기 위해 제대로 된 목표를 함께 세워봐요.",
	"image": "/photo/monthlyplan/monthlyplan_main.png",
  },
];

exports.gameList = gameList;
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