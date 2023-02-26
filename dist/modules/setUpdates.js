import fetch from "node-fetch";
export default function setUpdates(channelId, messageId, baseUrl, newContent, token) {
    return new Promise((resolve) => {
        fetch(`${baseUrl}/channels/${channelId}/messages/${messageId}`, {
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
