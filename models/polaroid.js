const Sequelize = require('sequelize');

class Polaroid extends Sequelize.Model {
  static initiate(sequelize) {
	Polaroid.init({
	  image: {
		type: Sequelize.STRING(100),
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
	  modelName: 'Polaroid',
	  tableName: 'polaroids',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {
    db.Polaroid.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'id' });
  }
};

module.exports = Polaroid;