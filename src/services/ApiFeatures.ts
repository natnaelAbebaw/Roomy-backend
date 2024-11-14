import { Model } from "mongoose";

type MongooseModel<T extends Document> = Model<T, {}>;

export class ApiFeatures {
  public query: any;
  constructor(private model: MongooseModel<any>, private body: any) {
    this.query = model.find();
  }

  applyFilter() {
    let filterObj = { ...this.body };
    const excludedFields = ["page", "limit", "fields", "sort", "q"];
    excludedFields.forEach((field) => delete filterObj[field]);
    filterObj = JSON.parse(
      JSON.stringify(filterObj).replace(
        /\b(gte|gt|lte|lt|in|all)\b/g,
        (match) => `$${match}`
      )
    );

    this.query = this.model.find(filterObj);
    return this;
  }

  applySearch() {
    if (this.body.q) {
      this.query = this.query.find({ $text: { $search: this.body.q } });
    }
    return this;
  }

  applySort() {
    if (this.body.sort) {
      console.log(this.body.sort);
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
    if (this.body.limit == 0) return;
    const page = this.body.page ? +this.body.page : 1;
    const limit = this.body.limit ? +this.body.limit : 3000;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    if (this.body.page) {
      const maxlength = await this.model.countDocuments();
      // if (skip >= maxlength)
      // throw new AppError("Page number exceeded more than expected.", 400);
    }
  }
}
