const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/restrictRoute");

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(
    authMiddleware.protect,
    restrictTo("manager"),
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(
    authMiddleware.protect,
    restrictTo("manager"),
    taskController.updateTask
  )
  .delete(
    authMiddleware.protect,
    restrictTo("manager"),
    taskController.deleteTask
  );

router
  .route("/:id/assignment/:userId")
  .patch(
    authMiddleware.protect,
    restrictTo("manager"),
    taskController.updateTaskAssignment
  );

module.exports = router;
