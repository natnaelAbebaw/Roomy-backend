"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.SearchLocationProxyController = void 0;
const controllerDecorator_1 = require("../decorators/controllerDecorator");
const routeHandlerDecorators_1 = require("../decorators/routeHandlerDecorators");
const Controllers_1 = require("../services/Controllers");
let SearchLocationProxyController = class SearchLocationProxyController extends Controllers_1.Controller {
    searchLocation() {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const { q: query } = req.query;
                const baseUrl = "https://services.gisgraphy.com/fulltext/fulltextsearch";
                const limit = 8;
                const url = `${baseUrl}?q="${query}"&format=json&lang=en&from=1&to=${limit}&placetype=city&allwordsrequired=false`;
                let results = [];
                try {
                    const response = yield fetch(url);
                    const locations = yield response.json();
                    results = locations["response"]["docs"].map((location, i) => {
                        var _a;
                        return ({
                            id: i,
                            address: location["fully_qualified_name"],
                            city: (_a = location["name_ascii"]) !== null && _a !== void 0 ? _a : location["name"],
                            country: location["country_name"],
                        });
                    });
                }
                catch (error) {
                    console.error("Error:", error);
                    console.log("error");
                    results = [];
                }
                res
                    .status(200)
                    .json({ status: "success", length: results.length, results });
            });
        };
    }
};
exports.SearchLocationProxyController = SearchLocationProxyController;
__decorate([
    (0, routeHandlerDecorators_1.get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchLocationProxyController.prototype, "searchLocation", null);
exports.SearchLocationProxyController = SearchLocationProxyController = __decorate([
    (0, controllerDecorator_1.controller)("/searchLocation")
], SearchLocationProxyController);
