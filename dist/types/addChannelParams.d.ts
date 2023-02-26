type properties<T> = {
    [K in keyof T]: {
        type: T[K] extends string ? "string" : T[K] extends number ? "number" : T[K] extends boolean ? "boolean" : T[K] extends any[] ? "array" : never;
        default?: T[K];
    };
};
interface addChannelParams<T> {
    channelId: string;
    readonly properties: properties<T>;
}
export default addChannelParams;
