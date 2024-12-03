const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A task must have a libelle",
        },
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isValidTime(value) {
          const startDate = new Date(value);
          const hours = startDate.getUTCHours();
          if (hours < 8 || hours >= 18) {
            throw new Error("Task start time must be between 08:00 and 18:00");
          }
        },
      },
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStart(value) {
          if (new Date(value) <= new Date(this.startTime)) {
            throw new Error("Task end time must be after the start time");
          }
        },
        isValidEndTime(value) {
          const endDate = new Date(value);
          const hours = endDate.getUTCHours();
          const minutes = endDate.getUTCMinutes();
          if (hours < 8 || (hours === 18 && minutes > 0) || hours > 18) {
            throw new Error("Task end time must be between 08:00 and 18:00");
          }
        },
      },
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.INTEGER, // ID de l'utilisateur
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    hooks: {
      async beforeValidate(task) {
        await calculateDuration(task);
      },
    },
  }
);

const calculateDuration = async (task) => {
  const startTime = new Date(task.startTime).getTime();
  const endTime = new Date(task.endTime).getTime();
  task.duration = (endTime - startTime) / (1000 * 60 * 60); // En heures
};

module.exports = Task;
