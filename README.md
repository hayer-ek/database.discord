# database.discord

## About
This module allows you to work with a database that uses discord as a place to store data
The database itself is running "very fast", perhaps this is the new era of all databases

## Installation

> **npm:** i database.discord
>
> **yarn:** add database.discord
>
> **pnpm:** add database.discord

## Examples
```typescript
import DataBase from "database.discord";

const db = new DataBase();
db.connect("<your Discord bot token>");

db.on("connect", () => {
    console.log("DataBase is connected!");
});
db.on("error", (e) => {
    console.error(`Error! ${e}`)
});

const channel = await db.createChannelDb({
    channelId: "<channel id>",
    properties: {
        str: { type: "string", default: "im a string" },
        num: { type: "number", default: 123 },
        bool: { type: "boolean", default: false },
        arr: { type: "array", default: ["default", "array"] },
    },
});

// Сreates a message with the given parameters
channel.createOne({ str: "hello world", num: 1 });  

//Deletes the message by the given filter
channel.deleteOne({ and: { 
    str: "hello world" , 
    num: 1 } 
}); 

// Searches for messages by the given parameters
channel.findMany({ or: { 
    str: { has: ["a", "b"] }, 
    bool: false } }, 
    { limit: 3 }
).then((res) => {
    console.log(res);
}); 

// Сhanges messages according to the given parameters
channel.updateOne(
    { and: { 
        arr: { has: ["example"] }, 
        num: { from: 3, to: 10 } } },
    { str: "new str" },
    { createIfNotFound: true, setDefault: true }
); 
```

## Source
This module is an open source project. You can find all the necessary code at [GitHub](https://github.com/hayer-ek/database.discord)