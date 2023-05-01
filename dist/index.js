"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkChannel_1 = __importDefault(require("./modules/checkChannel"));
const checkToken_1 = __importDefault(require("./modules/checkToken"));
const channelDb_1 = __importDefault(require("./components/channelDb"));
const events_1 = require("events");
class DataBase {
    constructor() {
        this.baseUrl = "https://discord.com/api/v10";
        this.emitter = new events_1.EventEmitter();
        this.isReady = false;
    }
    on(eventName, listener) {
        this.emitter.on(eventName, listener);
    }
    once(eventName, listener) {
        this.emitter.once(eventName, listener);
    }
    off(eventName, listener) {
        this.emitter.off(eventName, listener);
    }
    async connect(token, cb) {
        this.token = token;
        return await new Promise((resolve) => {
            (0, checkToken_1.default)(token, this.baseUrl).then((res) => {
                if (res == 401) {
                    this.emitter.emit("error", "Invalid token");
                    process.exit(1);
                }
                this.isReady = true;
                this.emitter.emit("connect");
                resolve();
                if (cb)
                    cb();
            });
        });
    }
    async createChannelDb(params) {
        if (!this.token) {
            this.emitter.emit("error", "You should connect first!");
            process.exit(1);
        }
        if (!this.isReady) {
            return new Promise((res) => {
                this.emitter.on("connect", () => {
                    this.createChannelDb(params).then((channel) => {
                        res(channel);
                    });
                });
            });
        }
        await (0, checkChannel_1.default)(this.token, params.channelId, this.baseUrl).then((res) => {
            if (res == 401) {
                this.emitter.emit("error", "Invalid token");
                process.exit(1);
            }
            if (res == 404) {
                this.emitter.emit("error", "Wrong channel id");
                process.exit(1);
            }
        });
        return new channelDb_1.default(params, this.token, this.baseUrl);
    }
}
exports.default = DataBase;
