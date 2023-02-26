import fetch from "node-fetch";
export default function deleteMessage(channelId, messageId, baseUrl, token) {
    return new Promise((resolve) => {
        fetch(`${baseUrl}/channels/${channelId}/messages/${messageId}`, {
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
            catch (_a) { }
            return js;
        })
            .then((res) => {
            if (res === null || res === void 0 ? void 0 : res.retry_after) {
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
