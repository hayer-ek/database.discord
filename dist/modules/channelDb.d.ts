import addChannelParams from "../types/addChannelParams";
import searchFilter from "../types/searchFilter";
import searchChanges from "../types/searchChanges";
import updateSearchParams from "../types/updateSearchParams";
import findSearchParams from "../types/findSearchParams";
declare class channelDb<T> {
    private readonly channelData;
    private token;
    private baseUrl;
    constructor(channelData: Readonly<addChannelParams<T>>, token: string, baseUrl: string);
    private findManyHandler;
    findOne(searchFilter: searchFilter<T>): Promise<T | undefined>;
    findMany(searchFilter: searchFilter<T>, searchParams?: findSearchParams): Promise<(T | undefined)[]>;
    updateOne(searchFilter: searchFilter<T>, changes: searchChanges<T>, searchParams?: updateSearchParams<false>): Promise<void>;
    updateMany(searchFilter: searchFilter<T>, changes: searchChanges<T>, searchParams?: updateSearchParams<true>): Promise<void>;
    createOne(data: searchChanges<T>): Promise<void>;
    deleteOne(searchFilter: searchFilter<T>): Promise<void>;
    deleteMany(searchFilter: searchFilter<T>, searchParams?: findSearchParams): Promise<unknown>;
}
export default channelDb;
