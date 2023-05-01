"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
function deleteMessage(channelId, messageId, baseUrl, token) {
    return new Promise((resolve) => {
        (0, node_fetch_1.default)(`${baseUrl}/channels/${channelId}/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bot ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
            let js;
            try {
                js = await res.json().catch(() => { });
            }
            catch { }
            return js;
        })
            .then((res) => {
            if (res?.retry_after) {
                setTimeout(() => {
                    deleteMessage(channelId, messageId, baseUrl, token).then(resolve);
                }, res.retry_after * 1000);
            }
            else {
                resolve();
            }
        });
    });
}
exports.default = deleteMessage;
