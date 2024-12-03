const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refreshToken", authController.refreshToken);

router.route("/").get(userController.getAllUsers);

router.get("/getMe", authMiddleware.protect, userController.getMe);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMyPassword", authController.updatePassword);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route("/:id/tasks").get(userController.getTasksByUser);

module.exports = router;
