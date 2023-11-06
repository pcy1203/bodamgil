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
	  snsId: {
		type: Sequelize.STRING(30),
		allowNull: true,
	  },
	  name: {
		type: Sequelize.STRING(20),
		allowNull: false,
	  },
	  introduction: {
		type: Sequelize.STRING(100),
		allowNull: true,
	  },
	  image: {
		type: Sequelize.STRING(100),
		allowNull: true,
	  },
	  tel: {
		type: Sequelize.STRING(100),
		allowNull: true,
	  },
	  gender: {
		type: Sequelize.ENUM('man', 'woman'),
		allowNull: true,
	  },
	  birthDate: {
		type: Sequelize.DATEONLY,
		allowNull: true,
	  },
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
	
  static associate(db) {
    db.User.hasMany(db.Polaroid, { foreignKey: 'writer', sourceKey: 'id' });
    db.User.hasOne(db.GlassBottle, { foreignKey: 'owner', sourceKey: 'id' });
    db.User.hasMany(db.PaperPlane, { foreignKey: 'writer', sourceKey: 'id' });
  }
};

module.exports = User;