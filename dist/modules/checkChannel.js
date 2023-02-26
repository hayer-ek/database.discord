import fetch from "node-fetch";
export default async function checkChannel(token, channelId, baseUrl) {
    await fetch(`${baseUrl}/channels/${channelId}`, {
        method: "GET",
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        if (res.status == 404) {
            throw new Error("Wrong channel id");
        }
        if (res.status == 401) {
            throw new Error("Wrong token");
        }
    });
}
