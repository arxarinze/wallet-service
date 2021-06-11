const Wallet = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
const Producer = require('../producers/producer.queue');
class WalletController {
    static createWallet = async (req, res, next) => {
        try {
            let user_id = ObjectID("60bd5f7dd2ddfd4dc011dca5");
            let body = req.body;
            let myWallet = new Wallet({
                _id: {
                    user_id,
                    wallet: body.name
                },
                description: body.description
            });
            myWallet.save(err => {
                if (err)
                    return res.status(500).send({ err })
                let balanceObj1 = [{
                    user_id,
                    currency: "BTC",
                    amount: 0.00,
                    type: "credit",
                    wallet: body.name,
                    category: "Wallet Transfer"
                }, {
                    user_id,
                    currency: "ETH",
                    amount: 0.00,
                    type: "credit",
                    wallet: body.name,
                    category: "Wallet Transfer"
                }]
                balanceObj1.map(obj => {
                    new Producer(process.env.RABBIT_MQ).walletQueue(obj);
                })
                return res.status(200).send({ status: 200, message: `Your wallet #${body.name} has been created!` })
            });
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = WalletController;