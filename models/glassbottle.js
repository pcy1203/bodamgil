const Sequelize = require('sequelize');

class GlassBottle extends Sequelize.Model {
  static initiate(sequelize) {
	GlassBottle.init({
	  numPaperPlane: {
		type: Sequelize.INTEGER.UNSIGNED,
		allowNull: false,
		defaultValue: 0,
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
	  modelName: 'GlassBottle',
	  tableName: 'glassbottles',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.GlassBottle.belongsTo(db.User, { foreignKey: 'owner', targetKey: 'id' });
    db.GlassBottle.hasMany(db.PaperPlane, { foreignKey: 'recipient', sourceKey: 'id' });
  }
};

module.exports = GlassBottle;