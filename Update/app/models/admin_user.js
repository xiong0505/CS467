/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define('admin_user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING(6),
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      }
	}	
    },
  
	{timestamps: false,

	freezeTableName: true,
 
       tableName: 'admin_user'

	});	
 
 	return Admin;
};
