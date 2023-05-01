import { convertForChannelDb } from "./convertType";

type searchChanges<T> = {
    [K in keyof convertForChannelDb<T>]?: convertForChannelDb<T>[K];
};

export default searchChanges;
