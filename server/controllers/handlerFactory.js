const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.getAll = (
  Model,
  { include = [], transform = null, ...defaultOptions } = {}
) => {
  return catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const queryOptions = {
      ...defaultOptions,
      include,
      ...features.buildQuery(),
    };

    const docs = await Model.findAll(queryOptions);

    if (!docs || docs.length === 0) {
      return next(new AppError("No document found", 404));
    }

    // Appliquer une transformation si une fonction `transform` est fournie
    const results = transform
      ? docs.map((doc) => transform(doc.toJSON()))
      : docs;

    res.status(200).json({
      status: "success",
      results: results.length,
      data: results,
    });
  });
};

exports.getOne = (Model) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.deleteOne = (Model, relatedContent) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }

    // Supprimer les documents liés, si applicable
    if (relatedContent) {
      const { fieldName } = relatedContent.queryParam;
      await relatedContent.Model.destroy({
        where: {
          [fieldName]: req.params.id,
        },
      });
    }

    await doc.destroy();
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }

    await doc.update(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new AppError("Error creating the document", 400));
    }

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

exports.sendResponse = (req, res) => {
  const response = res.locals.response;

  res.status(201).json({
    status: "success",
    data: {
      response,
    },
  });
};
