const Sequelize = require('sequelize');

class GameRecord extends Sequelize.Model {
  static initiate(sequelize) {
	GameRecord.init({
	  completedAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	  },
	}, {
	  sequelize,
	  timestamps: false,
	  underscored: false,
	  modelName: 'GameRecord',
	  tableName: 'gamerecords',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.GameRecord.belongsTo(db.User, { foreignKey: 'user', targetKey: 'id' });
    db.GameRecord.belongsTo(db.Game, { foreignKey: 'game', targetKey: 'name' });
  }
};

module.exports = GameRecord;