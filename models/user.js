const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
	User.init({
	  email: {
		type: Sequelize.STRING(40),
		allowNull: true,
		unique: true,
	  },
	  password: {
		type: Sequelize.STRING(100),
		allowNull: true,
	  },
	  provider: {
	    type: Sequelize.ENUM('local', 'kakao', 'google'),
		allowNull: false,
		defaultValue: 'local',
	  },
	  /*
	  name: {
		type: Sequelize.STRING(20),
		allowNull: false,
	  },
	  introduction: {
		type: Sequelize.STRING(200),
		allowNull: true,
	  },
	  */
	  signupDate: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	  }
	}, {
	  sequelize,
	  timestamps: false,
	  underscored: false,
	  modelName: 'User',
	  tableName: 'users',
	  paranoid: false,
	  charset: 'utf8mb4',
	  collate: 'utf8mb4_general_ci', 
	});
  }
	
  static associate(db) {}
};

module.exports = User;