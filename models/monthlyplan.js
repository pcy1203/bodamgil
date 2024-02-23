const Sequelize = require('sequelize');

class MonthlyPlan extends Sequelize.Model {
  static initiate(sequelize) {
	MonthlyPlan.init({
	  uuid: {
		type: Sequelize.STRING(50),
		allowNull: true,
	  },
	  year: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
	  },
	  month: {
		type: Sequelize.TINYINT.UNSIGNED,
		allowNull: false,
	  },
	  image: {
		type: Sequelize.STRING(100),
		allowNull: false,
	  },
	  name: {
		type: Sequelize.STRING(20),
		allowNull: false,
	  },
	  content: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  contentSpecific: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  contentMeasurable: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  contentAchievable: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  contentRelevant: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  contentTimelimited: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  createdAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	  }
	}, {
	  sequelize,
	  timestamps: false,
	  underscored: false,
	  modelName: 'MonthlyPlan',
	  tableName: 'monthlyplans',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.MonthlyPlan.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'id' });
    db.MonthlyPlan.hasMany(db.MonthlyPlan, { foreignKey: 'plan', sourceKey: 'id' });
  }
};

module.exports = MonthlyPlan;