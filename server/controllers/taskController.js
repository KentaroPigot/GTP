const { Task, User } = require("../models");
const TaskService = require("../services/taskService");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTasks = handlerFactory.getAll(Task, {
  include: [
    {
      model: User,
      as: "user",
      attributes: ["firstname", "id"],
    },
  ],
  transform: (task) => {
    if (task.user) {
      task.assignedTo = task.user; // Remplacer assignedTo par l'objet user
      delete task.user; // Supprimer la clé user
    }
    return task;
  },
});
exports.createTask = handlerFactory.createOne(Task);
exports.updateTask = handlerFactory.updateOne(Task);
exports.getTask = handlerFactory.getOne(Task);
exports.deleteTask = handlerFactory.deleteOne(Task);

exports.updateTaskAssignment = catchAsync(async (req, res, next) => {
  const { id: taskId, userId } = req.params;

  try {
    const { updatedTask, action } = await TaskService.updateAssignment(
      taskId,
      userId
    );
    res.status(200).json({
      status: "success",
      action, // "assign" ou "unassign" selon l'action effectuée
      data: { task: updatedTask },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
});
