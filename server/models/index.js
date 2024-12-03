const User = require("./userModel");
const Task = require("./taskModel");
const sequelize = require("../config/database");

User.hasMany(Task, {
  as: "tasks",
  onDelete: "CASCADE",
  foreignKey: "assignedTo",
});
Task.belongsTo(User, { as: "user", foreignKey: "assignedTo" });

module.exports = { User, Task, sequelize };
