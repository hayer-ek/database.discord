import checkToken from "./modules/checkToken.js";
import checkChannel from "./modules/checkChannel.js";
import channelDb from "./modules/channelDb.js";
class DataBase {
    constructor() {
        this.baseUrl = "https://discord.com/api/v10";
    }
    connect(token, cb) {
        this.token = token;
        checkToken(token, this.baseUrl, cb);
    }
    async createChannelDb(params) {
        if (!this.token) {
            throw new Error("You should connect first!");
        }
        await checkChannel(this.token, params.channelId, this.baseUrl);
        return new channelDb(params, this.token, this.baseUrl);
    }
}
export default DataBase;
