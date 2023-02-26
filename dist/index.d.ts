import channelDb from "./modules/channelDb.js";
import addChannelParams from "./types/addChannelParams.js";
declare class DataBase {
    private baseUrl;
    private token;
    connect(token: string, cb?: () => any): void;
    createChannelDb<T extends object>(params: addChannelParams<T>): Promise<channelDb<T>>;
}
export default DataBase;
