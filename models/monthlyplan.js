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
	  content: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  content_specific: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  content_measurable: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  content_achievable: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  content_relevant: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  content_timelimited: {
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