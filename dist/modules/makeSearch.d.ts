import searchFilter from "../types/searchFilter";
import addChannelParams from "../types/addChannelParams";
export default function makeSearch<T>(obj: T, searchFilter: searchFilter<T>, channelData: addChannelParams<T>): boolean;
