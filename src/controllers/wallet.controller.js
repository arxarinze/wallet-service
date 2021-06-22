const Wallet = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
const Producer = require('../producers/producer.queue');
const walletTransactionModel = require("../models/wallet-transaction.model");
const walletModel = require("../models/wallet.model");
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
                return res.status(200).send({
                    status: 200,
                    message: `Your wallet #${body.name} has been created!`
                })
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                error
            });
        }
    }
    static getWallet = async (req, res, next) => {
        let wallet = req.params.name;
        let user_id = "60bd5f7dd2ddfd4dc011dca5";
        let walletObj = await walletModel.findOne({
            _id: {
                user_id,
                wallet,
            }
        });
        let walletTransactions = await walletTransactionModel.find({
            user_id,
            wallet: walletObj._id.wallet,
        });
        let total = 0;
        let ethTotal = 0;
        let btcTotal = 0;
        walletTransactions.map(w => {
            if (w.currency == 'BTC' && w.type == "credit") {
                btcTotal = btcTotal + parseFloat(w.amount);
            }
            else if (w.currency == 'ETH' && w.type == "credit") {
                ethTotal = ethTotal + parseFloat(w.amount);
            }
            else if (w.currency == "BTC" && w.type == "debit") {
                btcTotal = btcTotal - parseFloat(w.amount);
            }
            else if (w.currency == 'ETH' && w.type == "debit") {
                ethTotal = ethTotal - parseFloat(w.amount);
            }
            // if (w.type == "credit")
            //     total = total + parseFloat(w.amount);
            // if (w.type == "debit") {
            //     total = total - parseFloat(w.amount);
            // }
        })
        let balance = {
            wallet,
            //Total: total,
            ETH: ethTotal,
            BTC: btcTotal
        };
        res.status(200).send(balance);
    }

    static moveFundsFromWallet(req, res, next) {
        let body = req.body
        let user_id = "60bd5f7dd2ddfd4dc011dca5";
        let balanceObj1 = [{
            user_id,
            currency: body.currency,
            amount: body.amount,
            type: "debit",
            wallet: body.source,
            category: "Wallet Transfer"
        }, {
            user_id,
            currency: body.currency,
            amount: body.amount,
            type: "credit",
            wallet: body.destination,
            category: "Wallet Transfer"
        }]
        balanceObj1.map(obj => {
            new Producer(process.env.RABBIT_MQ).walletQueue(obj);
        })
        res.status(200).send({
            status: 200,
            message: `Funds Transferred From ${body.source} To ${body.destination}`
        });
    }
}

module.exports = WalletController;