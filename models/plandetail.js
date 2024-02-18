const Sequelize = require('sequelize');

class PlanDetail extends Sequelize.Model {
  static initiate(sequelize) {
	PlanDetail.init({
	  uuid: {
		type: Sequelize.STRING(50),
		allowNull: true,
	  },
	  week: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
	  },
	  checked: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
	  },
	  content: {
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
	  modelName: 'PlanDetail',
	  tableName: 'plandetails',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.PlanDetail.belongsTo(db.MonthlyPlan, { foreignKey: 'plan', targetKey: 'id' });
  }
};

module.exports = PlanDetail;