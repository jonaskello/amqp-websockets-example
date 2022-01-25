import AMQPBaseClient from './amqp-base-client.js';
/**
 * AMQP 0-9-1 client over TCP socket.
 */
export default class AMQPClient extends AMQPBaseClient {
    readonly tls: boolean;
    readonly host: string;
    readonly port: number;
    private readonly insecure;
    private socket?;
    /**
     * @param url - uri to the server, example: amqp://user:passwd@localhost:5672/vhost
     */
    constructor(url: string);
    connect(): Promise<AMQPBaseClient>;
    private connectSocket;
    /**
     * @ignore
     * @param bytes to send
     * @return fulfilled when the data is enqueued
     */
    send(bytes: Uint8Array): Promise<void>;
    protected closeSocket(): void;
}
//# sourceMappingURL=amqp-socket-client.d.ts.map