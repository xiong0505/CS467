/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('award_entry', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    recipient_fname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    recipient_lname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    tableName: 'award_entry'
  });
};
