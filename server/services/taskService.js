const { Task, User } = require("../models");
const { Op } = require("sequelize");

class TaskService {
  // Vérifie si une tâche chevauche une autre
  static async checkTaskOverlap(userId, startTime, endTime) {
    const overlappingTasks = await Task.findAll({
      where: {
        assignedTo: userId,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime },
          },
          {
            startTime: { [Op.gt]: startTime },
            endTime: { [Op.lt]: endTime },
          },
        ],
      },
    });

    return overlappingTasks.length > 0;
  }

  // Vérifie si la charge de travail d'un utilisateur dépasse 8 heures
  static async checkDailyWorkload(userId, newTaskDuration) {
    const user = await User.findByPk(userId, { include: ["tasks"] });
    if (!user) {
      throw new Error("User not found");
    }

    const dailyWorkload = await user.calculateDailyWorkload(); // Charge quotidienne existante
    console.log(dailyWorkload);
    return dailyWorkload + newTaskDuration > 8; // Vérifier si ça dépasse 8h
  }

  static async updateAssignment(taskId, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.assignedTo) {
      if (task.assignedTo.toString() !== userId) {
        throw new Error(
          "Task is already assigned to another user. Unassign it first."
        );
      }

      const updatedTask = await TaskService.unassignTask(taskId);
      return { updatedTask, action: "unassign" };
    } else {
      const updatedTask = await TaskService.assignTask(taskId, userId);
      return { updatedTask, action: "assign" };
    }
  }

  static async assignTask(taskId, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Vérifier les chevauchements de tâches
    const hasOverlap = await TaskService.checkTaskOverlap(
      userId,
      task.startTime,
      task.endTime
    );
    if (hasOverlap) {
      throw new Error("User already has an overlapping task");
    }

    // Vérifier si la charge de travail dépasse 8 heures
    const newTaskDuration = task.duration; // Récupérer la durée
    console.log(newTaskDuration);
    const exceedsWorkload = await TaskService.checkDailyWorkload(
      userId,
      newTaskDuration
    );
    if (exceedsWorkload) {
      throw new Error("User's daily workload exceeds the 8-hour limit");
    }

    task.assignedTo = userId; // Assigner la tâche
    await task.save();
    return task;
  }

  // Désassigner une tâche d'un utilisateur
  static async unassignTask(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.assignedTo = null;
    await task.save();
    return task;
  }
}

module.exports = TaskService;
