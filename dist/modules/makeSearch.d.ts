import searchFilter from "../types/searchFilter";
import addChannelParams from "../types/addChannelParams";
import { convertForChannelDb } from "../types/convertType";
import findSearchParams from "../types/findSearchParams";
export default function makeSearch<A, T>(obj: T, searchFilter: searchFilter<convertForChannelDb<A>>, channelData: addChannelParams<T>, searchParams?: findSearchParams): boolean;
