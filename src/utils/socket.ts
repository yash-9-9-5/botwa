import makeWASocket, {
  proto,
  type AnyMessageContent,
  type SocketConfig,
  type WASocket,
  isJidGroup
} from "baileys";

interface Socket extends WASocket {
    sendMessage: (jid:string, content:AnyMessageContent, options?:any) => Promise<any>
}

export default async function createSocket(config: SocketConfig): Promise<WASocket> {
      const sock: WASocket = makeWASocket(config);
      return sock;
}