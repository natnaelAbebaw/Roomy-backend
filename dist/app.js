"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const controller_1 = require("./decorators/controller");
const App = (0, express_1.default)();
App.use((0, morgan_1.default)("combined"));
App.use(controller_1.router);
exports.default = App;
