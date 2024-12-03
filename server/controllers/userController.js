const handlerFactory = require("../controllers/handlerFactory");
const { Task, User } = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Créer une erreur si l'utilisateur envoie des données de mot de passe
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Cette route n'est pas destinée à la mise à jour du mot de passe. Veuillez utiliser /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtrer les champs non autorisés pour la mise à jour
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Mettre à jour l'utilisateur dans la base de données
  const updatedUser = await User.update(req.user.id, filteredBody);

  if (!updatedUser) {
    return next(new AppError("Impossible de mettre à jour l'utilisateur", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const result = await User.update(req.user.id, { active: false });

  if (!result) {
    return next(new AppError("Utilisateur introuvable", 404));
  }

  res.status(204).json({ status: "success", data: null });
});

exports.getAllUsers = handlerFactory.getAll(User, {
  include: [
    {
      model: Task,
      as: "tasks",
      attributes: ["id", "duration"],
    },
  ],
});
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

exports.getTasksByUser = catchAsync(async (req, res, next) => {
  const tasks = await Task.findAll({
    where: { assignedTo: req.params.id },
  });

  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});
