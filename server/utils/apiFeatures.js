const { Op } = require("sequelize");

class APIFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.options = {}; // Options pour la requête Sequelize
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // Supprimer les champs non liés aux filtres
    excludedFields.forEach((el) => delete queryObject[el]);

    // Ajouter les opérateurs comme $gte, $lt, etc.
    let filter = {};
    for (let [key, value] of Object.entries(queryObject)) {
      if (/\b(gte|gt|lte|lt)\b/.test(value)) {
        const [op, val] = value.split("$");
        filter[key] = { [Op[op]]: val };
      } else {
        filter[key] = value;
      }
    }

    // Ajouter les filtres dans les options
    this.options.where = filter;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return [field.substring(1), "DESC"]; // Tri descendant
        }
        return [field, "ASC"]; // Tri croissant
      });
      this.options.order = sortBy;
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const attributes = this.queryString.fields.split(",");
      this.options.attributes = attributes;
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const offset = (page - 1) * limit;

    this.options.limit = limit;
    this.options.offset = offset;
    return this;
  }

  buildQuery() {
    return this.options;
  }
}

module.exports = APIFeatures;
