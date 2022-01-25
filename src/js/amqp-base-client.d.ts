import AMQPChannel from "./amqp-channel";
import AMQPView from "./amqp-view";
/**
 * Base class for AMQPClients.
 * Implements everything except how to connect, send data and close the socket
 */
export default abstract class AMQPBaseClient {
  vhost: string;
  username: string;
  password: string;
  name?: string;
  platform?: string;
  channels: AMQPChannel[];
  protected connectPromise?: [(conn: AMQPBaseClient) => void, (err: Error) => void];
  protected closePromise?: [(value?: void) => void, (err: Error) => void];
  closed: boolean;
  blocked?: string;
  channelMax: number;
  frameMax: number;
  heartbeat: number;
  /**
   * @param name - name of the connection, set in client properties
   * @param platform - used in client properties
   */
  constructor(vhost: string, username: string, password: string, name?: string, platform?: string);
  /**
   * Open a channel
   * @param [id] - An existing or non existing specific channel
   */
  channel(id?: number): Promise<AMQPChannel>;
  /**
   * Gracefully close the AMQP connection
   * @param [reason] might be logged by the server
   */
  close(reason?: string, code?: number): Promise<unknown>;
  /**
   * Try establish a connection
   */
  abstract connect(): Promise<AMQPBaseClient>;
  /**
   * @ignore
   * @param bytes to send
   * @return fulfilled when the data is enqueued
   */
  abstract send(bytes: Uint8Array): Promise<void>;
  protected abstract closeSocket(): void;
  private rejectClosed;
  private rejectConnect;
  /**
   * Parse and act on frames in an AMQPView
   * @ignore
   */
  protected parseFrames(view: AMQPView): void;
}
//# sourceMappingURL=amqp-base-client.d.ts.map
