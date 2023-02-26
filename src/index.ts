import checkToken from "./modules/checkToken.js";
import checkChannel from "./modules/checkChannel.js";
import channelDb from "./modules/channelDb.js";
import addChannelParams from "./types/addChannelParams.js";

class DataBase {
    private baseUrl = "https://discord.com/api/v10";
    private token: string | undefined;

    public connect(token: string, cb?: () => any) {
        this.token = token;
        checkToken(token, this.baseUrl, cb);
    }

    public async createChannelDb<T extends object>(params: addChannelParams<T>) {
        if (!this.token) {
            throw new Error("You should connect first!");
        }
        await checkChannel(this.token, params.channelId, this.baseUrl);
        return new channelDb<T>(params, this.token, this.baseUrl);
    }
}

export default DataBase