type properties<T> = {
    [K in keyof T]: {
        type: T[K] extends string
            ? "string"
            : T[K] extends number
            ? "number"
            : T[K] extends boolean
            ? "boolean"
            : T[K] extends any[]
            ? "array"
            : never;
        default?: T[K];
    };
};

type untypedProperties = {
    [key: string]:
        | {
              type: "string";
              default?: string;
          }
        | {
              type: "number";
              default?: number;
          }
        | {
              type: "boolean";
              default?: boolean;
          }
        | {
              type: "array";
              default?: any[];
          }
        | never;
};

interface addChannelParams<T> {
    channelId: string;
    readonly properties: T extends object
        ? properties<T>
        : untypedProperties;
}

export default addChannelParams;
export { untypedProperties };
