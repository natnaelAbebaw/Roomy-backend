"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeatures = void 0;
class ApiFeatures {
    constructor(model, body) {
        this.model = model;
        this.body = body;
        this.query = model.find();
    }
    applyFilter() {
        let filterObj = Object.assign({}, this.body);
        const excludedFields = ["page", "limit", "fields", "sort", "q"];
        excludedFields.forEach((field) => delete filterObj[field]);
        filterObj = JSON.parse(JSON.stringify(filterObj).replace(/\b(gte|gt|lte|lt|in|all)\b/g, (match) => `$${match}`));
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
    applyPagnation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.body.limit == 0)
                return;
            const page = this.body.page ? +this.body.page : 1;
            const limit = this.body.limit ? +this.body.limit : 3000;
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
            if (this.body.page) {
                const maxlength = yield this.model.countDocuments();
                // if (skip >= maxlength)
                // throw new AppError("Page number exceeded more than expected.", 400);
            }
        });
    }
}
exports.ApiFeatures = ApiFeatures;
