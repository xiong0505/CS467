/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('company', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id: {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'company'
  });
};
