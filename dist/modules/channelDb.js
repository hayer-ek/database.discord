import makeSearch from "./makeSearch.js";
import findMessages from "./findMessages.js";
import setUpdates from "./setUpdates.js";
import createMessage from "./createMessage.js";
import deleteMessage from "./deleteMessage.js";
class channelDb {
    constructor(channelData, token, baseUrl) {
        this.channelData = channelData;
        this.token = token;
        this.baseUrl = baseUrl;
    }
    findManyHandler(searchFilter, results, searchParams, content, beforeId) {
        return new Promise((res) => {
            findMessages(100, this.baseUrl, this.channelData, this.token, beforeId).then((messages) => {
                messages.forEach((message) => {
                    if ((searchParams === null || searchParams === void 0 ? void 0 : searchParams.limit) &&
                        (results === null || results === void 0 ? void 0 : results.length) &&
                        (results === null || results === void 0 ? void 0 : results.length) >= (searchParams === null || searchParams === void 0 ? void 0 : searchParams.limit))
                        return;
                    try {
                        const obj = JSON.parse(message.content);
                        if (makeSearch(obj, searchFilter, this.channelData)) {
                            results === null || results === void 0 ? void 0 : results.push({ obj, message });
                            return;
                        }
                    }
                    catch (_a) { }
                });
                if ((searchParams === null || searchParams === void 0 ? void 0 : searchParams.limit) &&
                    (results === null || results === void 0 ? void 0 : results.length) &&
                    (results === null || results === void 0 ? void 0 : results.length) >= (searchParams === null || searchParams === void 0 ? void 0 : searchParams.limit)) {
                    if (results.length && content) {
                        const promises = results.map((msg) => {
                            return setUpdates(this.channelData.channelId, (msg === null || msg === void 0 ? void 0 : msg.message.id) || "", this.baseUrl, Object.assign(Object.assign({}, msg === null || msg === void 0 ? void 0 : msg.obj), content), this.token);
                        });
                        Promise.all(promises).then(() => {
                            res();
                        });
                        return;
                    }
                    res();
                    return;
                }
                if (messages.length < 100) {
                    if (results && results.length && content) {
                        const promises = results.map((msg) => {
                            return setUpdates(this.channelData.channelId, (msg === null || msg === void 0 ? void 0 : msg.message.id) || "", this.baseUrl, Object.assign(Object.assign({}, msg === null || msg === void 0 ? void 0 : msg.obj), content), this.token);
                        });
                        Promise.all(promises).then(() => {
                            res();
                        });
                        return;
                    }
                    if (results && (results === null || results === void 0 ? void 0 : results.length) > 0) {
                        res();
                        return;
                    }
                    if (!(searchParams === null || searchParams === void 0 ? void 0 : searchParams.createIfNotFound)) {
                        res(undefined);
                        return;
                    }
                    let newMessageContent = content;
                    if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.setDefault) {
                        Object.keys(this.channelData.properties).forEach((key) => {
                            if (newMessageContent[key] ||
                                this.channelData.properties[key].default == undefined)
                                return;
                            newMessageContent = Object.assign(Object.assign({}, newMessageContent), { [key]: this.channelData.properties[key].default });
                        });
                    }
                    createMessage(this.channelData.channelId, this.baseUrl, this.token, newMessageContent);
                    res();
                    return;
                }
                return this.findManyHandler(searchFilter, results, searchParams, content, messages[messages.length - 1].id).then((r) => res(r));
            });
        });
    }
    findOne(searchFilter) {
        const results = [];
        return new Promise((res) => this.findManyHandler(searchFilter, results, { limit: 1 }, undefined).then(() => {
            res(results.map((res) => res === null || res === void 0 ? void 0 : res.obj)[0]);
        }));
    }
    findMany(searchFilter, searchParams) {
        const results = [];
        return new Promise((res) => this.findManyHandler(searchFilter, results, searchParams, undefined).then(() => {
            res(results.map((res) => res === null || res === void 0 ? void 0 : res.obj));
        }));
    }
    updateOne(searchFilter, changes, searchParams) {
        const foundedMessages = [];
        return new Promise((res) => {
            return this.findManyHandler(searchFilter, foundedMessages, Object.assign(Object.assign({}, searchParams), { limit: 1 }), changes).then(() => res());
        });
    }
    updateMany(searchFilter, changes, searchParams) {
        const foundedMessages = [];
        return new Promise((res) => {
            this.findManyHandler(searchFilter, foundedMessages, searchParams, changes).then(() => res());
        });
    }
    createOne(data) {
        return new Promise((resolve) => {
            createMessage(this.channelData.channelId, this.baseUrl, this.token, data).then(resolve);
        });
    }
    deleteOne(searchFilter) {
        const foundedMessages = [];
        return new Promise((resolve) => {
            this.findManyHandler(searchFilter, foundedMessages, { limit: 1 }).then(() => {
                var _a;
                const message = (_a = foundedMessages[0]) === null || _a === void 0 ? void 0 : _a.message;
                if (!(message === null || message === void 0 ? void 0 : message.id)) {
                    resolve();
                    return;
                }
                deleteMessage(this.channelData.channelId, message.id, this.baseUrl, this.token).then(() => resolve());
            });
        });
    }
    deleteMany(searchFilter, searchParams) {
        const foundedMessages = [];
        return new Promise((resolve) => {
            this.findManyHandler(searchFilter, foundedMessages, searchParams).then(() => {
                const promises = foundedMessages.map((founded) => {
                    const message = founded === null || founded === void 0 ? void 0 : founded.message;
                    if (!(message === null || message === void 0 ? void 0 : message.id))
                        return;
                    return deleteMessage(this.channelData.channelId, message.id, this.baseUrl, this.token);
                });
                Promise.all(promises).then(resolve);
            });
        });
    }
}
export default channelDb;
