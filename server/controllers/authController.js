const { User } = require("../models");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { createSendToken } = require("../utils/tokenUtils");
const { promisify } = require("util");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, firstname, email, password, passwordConfirm, role } = req.body;

  if (!name || !firstname || !email || !password || !passwordConfirm) {
    return next(new AppError("Veuillez fournir tous les champs requis", 400));
  }

  const newUser = await User.create({
    name,
    firstname,
    email,
    password,
    passwordConfirm,
    role,
  });

  createSendToken(newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Veuillez fournir un email et un mot de passe", 400)
    );
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Email ou mot de passe incorrect", 401));
  }

  createSendToken(user, res);
});

exports.logout = (req, res) => {
  res.cookie("auth_token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie("refresh_token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_SECRET
  );
  const user = await User.findByPk(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError("Invalid refresh token", 401));
  }

  const newAccessToken = jwt.sign(
    user.id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token: newAccessToken,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Récupérer l'utilisateur en fonction de l'email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError("Aucun utilisateur trouvé avec cet email", 404));
  }

  // 2) Générer un token de réinitialisation du mot de passe
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Envoyer le token par email (fonction non implémentée ici)
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    // envoyer l'email avec le token (fonction d'email non implémentée ici)

    res.status(200).json({
      status: "success",
      message: "Token envoyé à l'email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("Erreur lors de l'envoi de l'email. Essayez plus tard!", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Récupérer l'utilisateur en fonction du token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Sequelize.Op.gt]: Date.now() },
    },
  });

  // 2) Vérifier si le token est valide et si l'utilisateur existe
  if (!user) {
    return next(new AppError("Token invalide ou expiré", 400));
  }

  // 3) Mettre à jour le mot de passe
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Créer un nouveau token et renvoyer la réponse
  createSendToken(user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Récupérer l'utilisateur
  const user = await User.findByPk(req.user.id);

  // 2) Vérifier le mot de passe actuel
  if (!(await user.correctPassword(req.body.passwordCurrent))) {
    return next(new AppError("Mot de passe incorrect", 400));
  }

  // 3) Mettre à jour le mot de passe
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Envoyer un nouveau token
  createSendToken(user, res);
});
