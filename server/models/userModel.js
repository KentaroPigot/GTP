const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "A name is required" },
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "A firstname is required" },
        notEmpty: { msg: "Firstname cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "Please enter a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 32],
          msg: "Password must be at least 8 characters long",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      validate: {
        isEqualToPassword(value) {
          if (value !== this.password) {
            throw new Error("Password confirmation does not match password");
          }
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee",
      validate: {
        isIn: [["employee", "manager"]],
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      async beforeCreate(user) {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
        user.passwordConfirm = undefined;
      },
      async beforeUpdate(user) {
        if (user.password && !user.isNewRecord) {
          user.passwordChangedAt = Date.now() - 1000;
        }
      },
    },
  }
);

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  [
    "password",
    "refreshToken",
    "passwordResetExpires",
    "passwordResetToken",
    "passwordChangedAt",
  ].forEach((field) => delete values[field]);
  return values;
};

User.prototype.correctPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

User.prototype.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

User.prototype.calculateDailyWorkload = async function () {
  const tasks = await this.getTasks({
    as: "tasks",
  });
  console.log(tasks);

  return tasks.reduce((total, task) => {
    const duration = calculateDuration(task);
    return total + duration;
  }, 0);
};

const calculateDuration = async (task) => {
  const startTime = new Date(task.startTime).getTime();
  const endTime = new Date(task.endTime).getTime();
  return (endTime - startTime) / (1000 * 60 * 60); // En heures
};

module.exports = User;
