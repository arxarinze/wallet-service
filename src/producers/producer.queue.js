var amqp = require('amqplib/callback_api');

class Producer {
    constructor(host) {
        this.host = host
    }

    accountQueue = (msg) => {
        amqp.connect(this.host, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'account-create';
                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                console.log(" [x] Sent %s", msg);
                channel.close();
            });
            connection.on('error', function (handle) {
                console.log(handle)
            });
        })
    }

    walletQueue = (msg) => {
        amqp.connect(this.host, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'wallet-create';
                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                console.log(" [x] Sent %s", msg);
                channel.close();
            });
            connection.on('error', function (handle) {
                console.log(handle)
            });
        })
    }
}

module.exports = Producer;