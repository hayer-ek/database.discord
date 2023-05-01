import fetch from "node-fetch";

export default function checkToken(token: string, baseUrl: string) {
    return fetch(baseUrl + "/users/@me", {
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        return res.status;
    });
}
