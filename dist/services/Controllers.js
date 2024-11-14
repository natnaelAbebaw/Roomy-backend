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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const AppError_1 = __importDefault(require("./AppError"));
const ApiFeatures_1 = require("./ApiFeatures");
class Controller {
    _getAll(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(req.query);
                const apiFeature = new ApiFeatures_1.ApiFeatures(model, req.query);
                const err = yield apiFeature
                    .applyFilter()
                    .applySearch()
                    .applySort()
                    .applyFields()
                    .applyPagnation()
                    .catch((err) => err);
                if (err)
                    return next(err);
                const resourses = yield apiFeature.query;
                let filterQuerys = Object.assign({}, req.query);
                const excludedFields = ["page", "limit", "fields", "sort", "q"];
                excludedFields.forEach((field) => delete filterQuerys[field]);
                filterQuerys = JSON.parse(JSON.stringify(filterQuerys).replace(/\b(gte|gt|lte|lt|in|all)\b/g, (match) => `$${match}`));
                const searchQuery = req.query.q && typeof req.query.q == "string"
                    ? { $text: { $search: req.query.q } }
                    : {};
                // console.log(filterQuerys);
                const totalItems = yield model.countDocuments(Object.assign(Object.assign({}, filterQuerys), searchQuery));
                // console.log(totalItems);
                // const ids = resourses.map((a: any) => a._id);
                res.status(200).json({
                    status: "success",
                    length: resourses.length,
                    // ids,
                    totalItems,
                    resourses,
                });
            });
        };
    }
    _getOne(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const resourse = yield model.findOne({ _id: id });
                if (!resourse)
                    return next(new AppError_1.default("Resourse not found.", 404));
                res.status(200).json({ status: "success", length: 1, resourse });
            });
        };
    }
    _create(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const resourse = yield model.create(req.body);
                res.status(201).json({ status: "success", length: 1, resourse });
            });
        };
    }
    _delete(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const resourse = yield model.findByIdAndDelete(req.params.id);
                if (!resourse)
                    return next(new AppError_1.default("resourse not found", 404));
                res.status(204).json({ status: "success" });
            });
        };
    }
    _update(model) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const resourse = yield model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                });
                if (!resourse)
                    return next(new AppError_1.default("resourse not found", 404));
                res.status(200).json({ status: "success", length: 1, resourse });
            });
        };
    }
    // _search(model: T) {
    //   return async function (req: Request, res: Response, next: NextFunction) {
    //     const resourse = await model.find(req.body);
    //   };
    // }
    getAll(model, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return req && res && next
                ? this._getAll(model)(req, res, next)
                : this._getAll(model);
        });
    }
    getOne(model, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return req && res && next
                ? this._getOne(model)(req, res, next)
                : this._getOne(model);
        });
    }
    create(model, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return req && res && next
                ? this._create(model)(req, res, next)
                : this._create(model);
        });
    }
    delete(model, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return req && res && next
                ? this._delete(model)(req, res, next)
                : this._delete(model);
        });
    }
    update(model, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return req && res && next
                ? this._update(model)(req, res, next)
                : this._update(model);
        });
    }
}
exports.Controller = Controller;
