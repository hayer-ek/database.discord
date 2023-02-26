import Message from "../types/message";
import addChannelParams from "../types/addChannelParams";

import fetch from "node-fetch";

export default function findMessages<T>(
    limit: number,
    baseUrl: string,
    channelData: addChannelParams<T>,
    token: string,
    beforeId?: string
): Promise<Message[]> {
    return new Promise((resolve) => {
        fetch(
            `${baseUrl}/channels/${channelData.channelId}/messages?limit=${limit}${
                beforeId ? `&before=${beforeId}` : ""
            }`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bot ${token}`,
                },
            }
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.retry_after) {
                    setTimeout(() => {
                        findMessages(limit, baseUrl, channelData, token, beforeId).then(resolve);
                    }, res.retry_after * 1000);
                    return
                }
                resolve(res);
            });
    });
}
