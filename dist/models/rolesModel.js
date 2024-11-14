"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesModel = exports.Roles = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var Roles;
(function (Roles) {
    Roles["admin"] = "admin";
    Roles["manager"] = "manager";
    Roles["receptionist"] = "receptionist";
})(Roles || (exports.Roles = Roles = {}));
const rolesSchema = new mongoose_1.default.Schema({
    role: { type: String, required: true, enum: Object.values(Roles) },
    hotel: { type: mongoose_1.default.Schema.ObjectId, ref: "Hotel", required: true },
    hotelAccount: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "HotelAccount",
        required: true,
    },
});
exports.RolesModel = mongoose_1.default.model("Role", rolesSchema);
