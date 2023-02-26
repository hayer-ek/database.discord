import fetch from "node-fetch";
export default function checkToken(token, baseUrl, cb) {
    fetch(baseUrl + "/users/@me", {
        headers: {
            Authorization: `Bot ${token}`,
        },
    }).then((res) => {
        if (res.status == 401) {
            throw new Error("Wrong token");
        }
        if (cb)
            cb();
    });
}
