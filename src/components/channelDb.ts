import addChannelParams from "../types/addChannelParams";
import searchFilter from "../types/searchFilter";
import searchChanges from "../types/searchChanges";
import updateSearchParams from "../types/updateSearchParams";
import findSearchParams from "../types/findSearchParams";
import Message from "../types/message";

import makeSearch from "../modules/makeSearch";
import findMessages from "../modules/findMessages";
import setUpdates from "../modules/setUpdates";
import createMessage from "../modules/createMessage";
import deleteMessage from "../modules/deleteMessage";
import { convertForChannelDb } from "../types/convertType";

class channelDb<A, T extends addChannelParams<A>> {
    private readonly channelData: T;
    private token: string;
    private baseUrl: string;

    constructor(
        channelData: Readonly<T>,
        token: string,
        baseUrl: string
    ) {
        this.channelData = channelData;
        this.token = token;
        this.baseUrl = baseUrl;
    }

    private findManyHandler(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        results?: ({ obj?: T; message: Message } | undefined)[],
        searchParams?:
            | updateSearchParams<true>
            | updateSearchParams<false>
            | findSearchParams
            | undefined,
        content?: searchChanges<T>,
        beforeId?: string
    ) {
        return new Promise<void>((res) => {
            findMessages(
                100,
                this.baseUrl,
                this.channelData,
                this.token,
                beforeId
            ).then((messages) => {
                messages.forEach((message) => {
                    if (
                        (searchParams as any)?.limit &&
                        results?.length &&
                        results?.length >=
                            (searchParams as any)?.limit
                    )
                        return;
                    try {
                        const obj: T = JSON.parse(message.content);
                        if (
                            makeSearch<T, unknown>(
                                obj,
                                searchFilter,
                                this.channelData,
                                searchParams as findSearchParams
                            )
                        ) {
                            results?.push({ obj, message });
                            return;
                        }
                    } catch {}
                });

                if (
                    (searchParams as any)?.limit &&
                    results?.length &&
                    results?.length >= (searchParams as any)?.limit
                ) {
                    // Если был достигнут лимит
                    if (results.length && content) {
                        const promises = results.map((msg) => {
                            return setUpdates(
                                this.channelData.channelId,
                                msg?.message.id || "",
                                this.baseUrl,
                                { ...msg?.obj, ...content },
                                this.token
                            );
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
                    // Если сообщения закончились
                    if (results && results.length && content) {
                        // Если мы использовали функцию update
                        const promises = results.map((msg) => {
                            return setUpdates(
                                this.channelData.channelId,
                                msg?.message.id || "",
                                this.baseUrl,
                                { ...msg?.obj, ...content },
                                this.token
                            );
                        });
                        Promise.all(promises).then(() => {
                            res();
                        });
                        return;
                    }

                    if (results && results?.length > 0) {
                        // Если поиск прошел успешно
                        res();
                        return;
                    }

                    if (
                        !(searchParams as updateSearchParams<true>)
                            ?.createIfNotFound
                    ) {
                        res(undefined);
                        return;
                    }

                    // Создает новое сообщение, если это указано в параметрах
                    let newMessageContent = content;
                    if (
                        (searchParams as updateSearchParams<true>)
                            ?.setDefault
                    ) {
                        Object.keys(
                            this.channelData.properties
                        ).forEach((key) => {
                            if (
                                (newMessageContent as any)[key] ||
                                (this.channelData.properties as any)[
                                    key
                                ].default == undefined
                            )
                                return;
                            newMessageContent = {
                                ...newMessageContent,
                                ...{
                                    [key]: (
                                        this.channelData
                                            .properties as any
                                    )[key].default,
                                },
                            };
                        });
                    }
                    createMessage(
                        this.channelData.channelId,
                        this.baseUrl,
                        this.token,
                        newMessageContent
                    );

                    res();
                    return;
                }
                // Продолжает поиск
                return this.findManyHandler(
                    searchFilter,
                    results,
                    searchParams,
                    content,
                    messages[messages.length - 1].id
                ).then((r) => res(r));
            });
        });
    }

    public findOne(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        searchParams?: findSearchParams
    ) {
        const results: ({ obj?: T; message: Message } | undefined)[] =
            [];

        return new Promise<T | undefined>((res) =>
            this.findManyHandler(
                searchFilter,
                results,
                { ...searchParams, limit: 1 },
                undefined
            ).then(() => {
                res(results.map((res) => res?.obj)[0]);
            })
        );
    }

    public findMany(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        searchParams?: findSearchParams
    ) {
        const results: ({ obj?: T; message: Message } | undefined)[] =
            [];

        return new Promise<(T | undefined)[]>((res) =>
            this.findManyHandler(
                searchFilter,
                results,
                searchParams,
                undefined
            ).then(() => {
                res(results.map((res) => res?.obj));
            })
        );
    }

    public updateOne(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        changes: searchChanges<T>,
        searchParams?: updateSearchParams<false>
    ) {
        const foundedMessages: (
            | { obj?: T; message: Message }
            | undefined
        )[] = [];
        return new Promise<void>((res) => {
            return this.findManyHandler(
                searchFilter,
                foundedMessages,
                { ...searchParams, limit: 1 },
                changes
            ).then(() => res());
        });
    }

    public updateMany(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        changes: searchChanges<T>,
        searchParams?: updateSearchParams<true>
    ) {
        const foundedMessages: (
            | { obj?: T; message: Message }
            | undefined
        )[] = [];
        return new Promise<void>((res) => {
            this.findManyHandler(
                searchFilter,
                foundedMessages,
                searchParams,
                changes
            ).then(() => res());
        });
    }

    public createOne(data: searchChanges<T>) {
        return new Promise<void>((resolve) => {
            createMessage(
                this.channelData.channelId,
                this.baseUrl,
                this.token,
                data
            ).then(resolve);
        });
    }

    public deleteOne(
        searchFilter: searchFilter<convertForChannelDb<T>>
    ) {
        const foundedMessages: (
            | { obj?: T; message: Message }
            | undefined
        )[] = [];
        return new Promise<void>((resolve) => {
            this.findManyHandler(searchFilter, foundedMessages, {
                limit: 1,
            }).then(() => {
                const message = foundedMessages[0]?.message;
                if (!message?.id) {
                    resolve();
                    return;
                }
                deleteMessage(
                    this.channelData.channelId,
                    message.id,
                    this.baseUrl,
                    this.token
                ).then(() => resolve());
            });
        });
    }

    public deleteMany(
        searchFilter: searchFilter<convertForChannelDb<T>>,
        searchParams?: findSearchParams
    ) {
        const foundedMessages: (
            | { obj?: T; message: Message }
            | undefined
        )[] = [];
        return new Promise((resolve) => {
            this.findManyHandler(
                searchFilter,
                foundedMessages,
                searchParams
            ).then(() => {
                const promises = foundedMessages.map((founded) => {
                    const message = founded?.message;
                    if (!message?.id) return;
                    return deleteMessage(
                        this.channelData.channelId,
                        message.id,
                        this.baseUrl,
                        this.token
                    );
                });
                Promise.all(promises).then(resolve);
            });
        });
    }
}

export default channelDb;
