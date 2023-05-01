"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function checkToken(token, baseUrl) {
    return (0, node_fetch_1.default)(baseUrl + "/users/@me", {
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        return res.status;
    });
}
exports.default = checkToken;
