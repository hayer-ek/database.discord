import checkChannel from "./modules/checkChannel";
import checkToken from "./modules/checkToken";
import channelDb from "./components/channelDb";
import { EventEmitter } from "events";

import addChannelParams from "./types/addChannelParams";
import events from "./types/events";

class DataBase {
    private baseUrl = "https://discord.com/api/v10";
    private token: string | undefined;
    private emitter = new EventEmitter();
    private isReady = false;

    public on<T extends keyof events>(
        eventName: T,
        listener: events[T]
    ) {
        this.emitter.on(eventName, listener);
    }

    public once<T extends keyof events>(
        eventName: T,
        listener: events[T]
    ) {
        this.emitter.once(eventName, listener);
    }

    public off<T extends keyof events>(
        eventName: T,
        listener: events[T]
    ) {
        this.emitter.off(eventName, listener);
    }

    public async connect(
        token: string,
        cb?: (...args: any) => unknown
    ) {
        this.token = token;
        return await new Promise<void>((resolve) => {
            checkToken(token, this.baseUrl).then((res) => {
                if (res == 401) {
                    this.emitter.emit("error", "Invalid token");
                    process.exit(1);
                }

                this.isReady = true;
                this.emitter.emit("connect");
                resolve();
                if (cb) cb();
            });
        });
    }

    public async createChannelDb<A, T extends addChannelParams<A>>(
        params: T
    ) {
        if (!this.token) {
            this.emitter.emit("error", "You should connect first!");
            process.exit(1);
        }

        if (!this.isReady) {
            return new Promise<channelDb<A, T>>((res) => {
                this.emitter.on("connect", () => {
                    this.createChannelDb(params).then((channel) => {
                        res(channel);
                    });
                });
            });
        }

        await checkChannel(
            this.token,
            params.channelId,
            this.baseUrl
        ).then((res) => {
            if (res == 401) {
                this.emitter.emit("error", "Invalid token");
                process.exit(1);
            }

            if (res == 404) {
                this.emitter.emit("error", "Wrong channel id");
                process.exit(1);
            }
        });

        return new channelDb<A, T>(params, this.token, this.baseUrl);
    }
}

export default DataBase;