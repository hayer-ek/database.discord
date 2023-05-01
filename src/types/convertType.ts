type convertForChannelDb<T> = T extends {
    channelId: string;
    properties: {
        [key: string]: {
            type: "number" | "string" | "boolean" | "array";
            default?: any;
        };
    };
}
    ? {
          [K in keyof T["properties"]]: T["properties"][K]["type"] extends "number"
              ? number
              : T["properties"][K]["type"] extends "string"
              ? string
              : T["properties"][K]["type"] extends "boolean"
              ? boolean
              : T["properties"][K]["type"] extends "array"
              ? Array<any>
              : unknown;
      }
    : never;

export { convertForChannelDb };
