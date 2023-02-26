# database.discord

## About
This module allows you to work with a database that uses discord as a place to store data
The database itself is running "very fast", perhaps this is the new era of all databases

## Installation

> **npm:** npm i database.discord
> 
> **yarn:** yarn add database.discord
> 
> **pnpm:** pnpm add database.discord

## Examples
```typescript
import DataBase from "database.discord";

const db = new DataBase();
db.connect("<your Discord bot token>", () => {
    console.log("db is connected");
});

type types = {
    str: string;
    num: number;
    bool: boolean;
    arr: string[];
};

const channel = await db.createChannelDb<types>({
    channelId: "<channel id>",
    properties: {
        str: { type: "string", default: "im a string" },
        num: { type: "number", default: 123 },
        bool: { type: "boolean", default: false },
        arr: { type: "array", default: ["default", "array"] },
    },
});

channel.createOne({ str: "hello world", num: 1 });  // Сreates a message with the given parameters

channel.deleteOne({ and: { str: { equals: "hello world" }, num: 1 } }); //Deletes the message by the given filter

channel.findMany({ or: { str: { has: ["a", "b"] }, bool: false } }, { limit: 3 }).then((res) => {
    console.log(res);
}); // Searches for messages by the given parameters

channel.updateOne(
    { and: { arr: { has: ["example"] }, num: { from: 3, to: 10 } } },
    { str: "new str" },
    { createIfNotFound: true, setDefault: true }
); // Сhanges messages according to the given parameters
```
