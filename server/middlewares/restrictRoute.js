const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const restrictTo = (role) =>
  catchAsync(async (req, res, next) => {
    if (req.user.role !== role) {
      return next(
        new AppError("You do not have the privilege to access this route.", 401)
      );
    }
    next();
  });

module.exports = restrictTo;
