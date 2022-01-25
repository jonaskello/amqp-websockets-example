import AMQPChannel from './amqp-channel.js';
import { AMQPProperties } from './amqp-properties.js';
/**
 * AMQP message
 * @property {AMQPChannel} channel - Channel this message was delivered on
 * @property {string} exchange - The exchange the message was published to
 * @property {string} routingKey - The routing key the message was published with
 * @property {object} properties - Message metadata
 * @property {number} bodySize - Byte size of the body
 * @property {Uint8Array} body - The raw message body
 * @property {number} deliveryTag - The deliveryTag of this message
 * @property {boolean} redelivered - The consumer tag, if deliveried to a consumer
 * @property {string?} consumerTag - The consumer tag, if deliveried to a consumer
 * @property {number?} messageCount - Number of messages left in queue (when polling)
 * @property {number} replyCode - Code if message was returned
 * @property {string} replyText - Error message on why message was returned
 */
export default class AMQPMessage {
    channel: AMQPChannel;
    exchange: string;
    routingKey: string;
    properties: AMQPProperties;
    bodySize: number;
    body?: Uint8Array;
    bodyPos: number;
    deliveryTag: number;
    consumerTag: string;
    redelivered: boolean;
    messageCount?: number;
    replyCode?: number;
    replyText?: string;
    static decoder: TextDecoder;
    /**
     * @param channel - Channel this message was delivered on
     */
    constructor(channel: AMQPChannel);
    /**
     * Converts the message (which is deliviered as an uint8array) to a string
     */
    bodyToString(): string;
    bodyString(): string;
    /** Acknowledge the message */
    ack(multiple?: boolean): Promise<void>;
    /** Negative acknowledgment (same as reject) */
    nack(requeue?: boolean, multiple?: boolean): Promise<void>;
    /** Rejected the message */
    reject(requeue?: boolean): Promise<void>;
    /** Cancel the consumer the message arrived to **/
    cancelConsumer(): Promise<AMQPChannel>;
}
//# sourceMappingURL=amqp-message.d.ts.map