var amqp = require('amqplib/callback_api');

class Consumer {
    constructor(host) {
        this.host = host
    }

    balanceQueue = (msg) => {
        amqp.connect(this.host, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'balance';
                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                console.log(" [x] Sent %s", msg);
            });
        })
    }
}

module.exports = Consumer;