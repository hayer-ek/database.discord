import searchChanges from "../types/searchChanges";
export default function setUpdates<T>(channelId: string, messageId: string, baseUrl: string, newContent: searchChanges<T>, token: string): Promise<void>;
