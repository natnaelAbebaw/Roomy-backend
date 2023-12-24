import { Model } from "mongoose";
import AppError from "./AppError";
type MongooseModel<T extends Document> = Model<T, {}>;

export class ApiFeatures {
  public query: any;
  constructor(
    private model: MongooseModel<any>,
    private body: any,
  ) {
  ;
    this.query = model.find();
  }

  applyFilter() {
    let filterObj = { ...this.body};
    const excludedFields = ["page", "limit", "fields", "sort"];
    excludedFields.forEach((field) => delete filterObj[field]);
    filterObj = JSON.parse(
      JSON.stringify(filterObj).replace(
        /\b(gte|gt|lte|le)\b/g,
        (match) => `$${match}`
      )
    );
    this.query = this.model.find(filterObj);
    return this;
  }

  applySort() {
    if (this.body.sort) {
      const sortBy = this.body.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }
  applyFields() {
    if (this.body.fields) {
      const selectBy = this.body.fields.split(",").join(" ");
      this.query = this.query.select(selectBy);
    }

    return this;
  }
  async applyPagnation() {
    const page = this.body.page ? +this.body.page : 1;
    const limit = this.body.limit ? +this.body.limit : 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    if (this.body.page) {
      const maxlength = await this.model.countDocuments();
      if (skip >= maxlength)
        throw new AppError("Page number exceeded more than expected.", 400);
    }
  }
}
