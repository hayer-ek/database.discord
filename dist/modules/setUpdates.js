"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function setUpdates(channelId, messageId, baseUrl, newContent, token) {
    return new Promise((resolve) => {
        (0, node_fetch_1.default)(`${baseUrl}/channels/${channelId}/messages/${messageId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bot ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: JSON.stringify(newContent) }),
        })
            .then((res) => res.json())
            .then((res) => {
            if (res.retry_after) {
                setTimeout(() => {
                    setUpdates(channelId, messageId, baseUrl, newContent, token).then(() => resolve());
                }, res.retry_after * 1000);
            }
            else {
                resolve();
            }
        });
    });
}
exports.default = setUpdates;
