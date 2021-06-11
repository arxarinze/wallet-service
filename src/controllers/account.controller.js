let BTCService = require('../services/btc.service');
let ETHService = require('../services/eth.service');
const Account = require("../models/account.model");
const { ObjectID } = require('mongodb');
const Producer = require('../producers/producer.queue');
class AccountController {
    static createAccount = async (req, res, next) => {
        const myAccount = new Account({
            user_id: ObjectID(),
            username: "tnk",
            account:
            {
                BTC: await BTCService.createWallet(),
                ETH: await ETHService.createWallet(),
            }

        });

        myAccount.save(err => {
            if (err)
                return res.status(500).send({ err })
            let user_id = ObjectID("60bd5f7dd2ddfd4dc011dca5");
            let balanceObj = [{
                user_id,
                currency: "BTC",
                amount: 0.00,
                type: "credit",
                details: {
                    receiver: myAccount.account.BTC.address,
                    sender: "core"
                },
                category: "Initial",
                data: {},
                wallet: "default",
            },
            {
                user_id,
                currency: "ETH",
                amount: 0.00,
                type: "credit",
                details: {
                    receiver: myAccount.account.ETH.address,
                    sender: "core"
                },
                category: "Initial",
                data: {},
                wallet: "default",
            }
            ]
            balanceObj.map(obj => {
                new Producer(process.env.RABBIT_MQ).accountQueue(obj);
            });

            return res.status(200).send({
                status: 200,
                message: "Wallet Created"
            })
        });
    }
}
module.exports = AccountController