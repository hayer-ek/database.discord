import fetch from "node-fetch";
export default function createMessage(channelId, baseUrl, token, content) {
    return new Promise((resolve) => {
        fetch(`${baseUrl}/channels/${channelId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: JSON.stringify(content) }),
        })
            .then((res) => res.json())
            .then((res) => {
            if (res.retry_after) {
                setTimeout(() => {
                    createMessage(channelId, baseUrl, token, content).then(resolve);
                }, res.retry_after * 1000);
                return;
            }
            resolve();
            return;
        });
    });
}
