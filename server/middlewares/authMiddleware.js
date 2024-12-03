const { User } = require("../models");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const { signToken } = require("../utils/tokenUtils");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  try {
    // Vérifier le token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to the token does no longer exist",
          401
        )
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Si l'access token a expiré, essayer de rafraîchir avec le refresh token
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(new AppError("Refresh token not available", 401));
      }

      console.log("pass");

      const decoded = await promisify(jwt.verify)(
        refreshToken,
        process.env.JWT_SECRET
      );
      console.log("Refresh token decoded:", decoded);

      const user = await User.findByPk(decoded.id);
      console.log("User fetched from DB:", user);

      if (!user || user.refreshToken !== refreshToken) {
        console.log("Invalid user or refresh token mismatch");
        return next(new AppError("Invalid refresh token", 401));
      }

      const id = user.id.toString();
      console.log("User ID to be signed:", id);

      const expiresIn = process.env.JWT_EXPIRES_IN;
      const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn,
      });

      console.log("Generated new access token:", newAccessToken);

      const accessCookieExpires =
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 1000;
      res.cookie("auth_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(Date.now() + accessCookieExpires),
      });

      console.log("New token set in cookie");

      req.user = user;
      next();
    } else {
      next(err);
    }
  }
});
