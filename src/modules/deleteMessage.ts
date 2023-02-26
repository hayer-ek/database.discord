import fetch from "node-fetch";

export default function deleteMessage(channelId: string, messageId: string, baseUrl: string, token: string) {
    return new Promise<void>((resolve) => {
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
                    js = await res.json().catch(() => {});
                } catch {}
                return js;
            })
            .then((res) => {
                if (res?.retry_after) {
                    setTimeout(() => {
                        deleteMessage(channelId, messageId, baseUrl, token).then(resolve);
                    }, res.retry_after * 1000);
                } else {
                    resolve();
                }
            });
    });
}
