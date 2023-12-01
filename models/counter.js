const Sequelize = require('sequelize');

class Counter extends Sequelize.Model {
  static initiate(sequelize) {
	Counter.init({
	  date: {
		type: Sequelize.STRING(10),
		allowNull: false,
		unique: true,
	  },
	  count: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		defaultValue: 0,
	  }
	}, {
	  sequelize,
	  timestamps: false,
	  underscored: false,
	  modelName: 'Counter',
	  tableName: 'counters',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) { }
};

module.exports = Counter;