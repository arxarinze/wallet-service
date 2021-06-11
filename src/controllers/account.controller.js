let BTCService = require('../services/btc.service');
let ETHService = require('../services/eth.service');
const Account = require("../models/account.model");
const Wallet = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
const Producer = require('../producers/producer.queue');
class AccountController {
    static createAccount = async (req, res, next) => {
        try {
            let user_id = ObjectID("60bd5f7dd2ddfd4dc011dca5");
            let account = await Account.findOne({ user_id });
            if (account != null) {
                const myAccount = new Account({
                    user_id,
                    account:
                    {
                        BTC: await BTCService.createWallet(),
                        ETH: await ETHService.createWallet(),
                    }

                });
                myAccount.save(err => {
                    if (err)
                        return res.status(500).send({ err })
                    let myWallet = new Wallet({
                        _id: {
                            user_id,
                            wallet: "default"
                        }
                    });
                    myWallet.save(err => {
                        if (err)
                            return res.status(500).send({ err })
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

                        }
                        ];
                        let balanceObj1 = [{
                            user_id,
                            currency: "BTC",
                            amount: 0.00,
                            type: "credit",
                            name: "default",
                            category: "Wallet Transfer"
                        }, {
                            user_id,
                            currency: "ETH",
                            amount: 0.00,
                            type: "credit",
                            name: "default",
                            category: "Wallet Transfer"
                        }]


                        balanceObj.map(obj => {
                            new Producer(process.env.RABBIT_MQ).accountQueue(obj);
                        });
                        balanceObj1.map(obj => {
                            new Producer(process.env.RABBIT_MQ).walletQueue(obj);
                        })
                        return res.status(200).send({
                            status: 200,
                            message: "Account Is Being SetUp"
                        })
                    })

                });
            }
            else {
                return res.status(202).send({ status: 202, message: "Already Created" })
            }
        } catch (error) {
            return res.status(500).send({ error })
        }
    }
}
module.exports = AccountController