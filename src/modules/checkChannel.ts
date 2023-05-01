import fetch from "node-fetch";

export default async function checkChannel(
    token: string,
    channelId: string,
    baseUrl: string
) {
    return fetch(`${baseUrl}/channels/${channelId}`, {
        method: "GET",
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        return res.status;
    });
}
