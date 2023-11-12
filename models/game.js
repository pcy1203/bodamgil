const Sequelize = require('sequelize');

class Game extends Sequelize.Model {
  static initiate(sequelize) {
	Game.init({
	  name: {
		type: Sequelize.STRING(20),
		allowNull: false,
		unique: true,
	  },
	  title: {
		type: Sequelize.STRING(100),
		allowNull: false,
		unique: true,
	  },
	  introduction: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  image: {
		type: Sequelize.STRING(100),
		allowNull: false,
	  },
	}, {
	  sequelize,
	  timestamps: false,
	  underscored: false,
	  modelName: 'Game',
	  tableName: 'games',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.Game.hasMany(db.GameRecord, { foreignKey: 'game', sourceKey: 'name' });
  }
};

module.exports = Game;