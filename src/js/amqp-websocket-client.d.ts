import AMQPBaseClient from "./amqp-base-client";
/**
 * WebSocket client for AMQP 0-9-1 servers
 */
export default class AMQPWebSocketClient extends AMQPBaseClient {
  readonly url: string;
  private socket?;
  /**
   * @param url to the websocket endpoint, example: wss://server/ws/amqp
   */
  constructor(url: string, vhost?: string, username?: string, password?: string, name?: string);
  /**
   * Establish a AMQP connection over WebSocket
   */
  connect(): Promise<AMQPBaseClient>;
  /**
   * @param bytes to send
   * @return fulfilled when the data is enqueued
   */
  send(bytes: Uint8Array): Promise<void>;
  protected closeSocket(): void;
  private framePos;
  private frameSize;
  private frameBuffer;
  private handleMessage;
  static platform(): string;
}
//# sourceMappingURL=amqp-websocket-client.d.ts.map
