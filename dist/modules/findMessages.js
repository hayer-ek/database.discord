"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function findMessages(limit, baseUrl, channelData, token, beforeId) {
    return new Promise((resolve) => {
        (0, node_fetch_1.default)(`${baseUrl}/channels/${channelData.channelId}/messages?limit=${limit}${beforeId ? `&before=${beforeId}` : ""}`, {
            method: "GET",
            headers: {
                Authorization: `Bot ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
            if (res.retry_after) {
                setTimeout(() => {
                    findMessages(limit, baseUrl, channelData, token, beforeId).then(resolve);
                }, res.retry_after * 1000);
                return;
            }
            resolve(res);
        });
    });
}
exports.default = findMessages;
