const Sequelize = require('sequelize');

class PaperPlane extends Sequelize.Model {
  static initiate(sequelize) {
	PaperPlane.init({
	  content: {
		type: Sequelize.TEXT,
		allowNull: false,
	  },
	  name: {
		type: Sequelize.STRING(14),
		allowNull: false,
	  },
	  relationship: {
	    type: Sequelize.ENUM('friend', 'couple', 'family', 'school', 'colleague', 'etc'),
		allowNull: false,
		defaultValue: 'friend',
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
	  modelName: 'PaperPlane',
	  tableName: 'paperplanes',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.PaperPlane.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'id' });
    db.PaperPlane.belongsTo(db.GlassBottle, { foreignKey: 'recipient', targetKey: 'id' });
  }
};

module.exports = PaperPlane;