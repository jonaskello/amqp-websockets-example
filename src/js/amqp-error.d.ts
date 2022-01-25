import AMQPBaseClient from './amqp-base-client.js';
/**
 * An error, can be both AMQP level errors or socket errors
 * @property {string} message
 * @property {AMQPBaseClient} connection - The connection the error was raised on
 */
export default class AMQPError extends Error {
    connection: AMQPBaseClient;
    /**
     * @param message - Error description
     * @param connection - The connection the error was raised on
     */
    constructor(message: string, connection: AMQPBaseClient);
}
//# sourceMappingURL=amqp-error.d.ts.map