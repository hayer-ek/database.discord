"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function checkChannel(token, channelId, baseUrl) {
    return (0, node_fetch_1.default)(`${baseUrl}/channels/${channelId}`, {
        method: "GET",
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        return res.status;
    });
}
exports.default = checkChannel;
