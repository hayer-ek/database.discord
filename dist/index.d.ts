import channelDb from "./components/channelDb";
import addChannelParams from "./types/addChannelParams";
import events from "./types/events";
declare class DataBase {
    private baseUrl;
    private token;
    private emitter;
    private isReady;
    on<T extends keyof events>(eventName: T, listener: events[T]): void;
    once<T extends keyof events>(eventName: T, listener: events[T]): void;
    off<T extends keyof events>(eventName: T, listener: events[T]): void;
    connect(token: string, cb?: (...args: any) => unknown): Promise<void>;
    createChannelDb<A, T extends addChannelParams<A>>(params: T): Promise<channelDb<A, T>>;
}
export default DataBase;
