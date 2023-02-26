import Message from "../types/message";
import addChannelParams from "../types/addChannelParams";
export default function findMessages<T>(limit: number, baseUrl: string, channelData: addChannelParams<T>, token: string, beforeId?: string): Promise<Message[]>;
