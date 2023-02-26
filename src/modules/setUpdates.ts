import searchChanges from "../types/searchChanges";
import fetch from "node-fetch";

export default function setUpdates<T>(
    channelId: string,
    messageId: string,
    baseUrl: string,
    newContent: searchChanges<T>,
    token: string
) {
    return new Promise<void>((resolve) => {
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
                } else {
                    resolve();
                }
            });
    });
}
