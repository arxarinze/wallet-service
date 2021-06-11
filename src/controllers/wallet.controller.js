let BTCService = require('../services/btc.service');
let ETHService = require('../services/eth.service');
const Wallets = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
const Producer = require('../producers/producer.queue');
class WalletController {
    static createWallet = async (req, res, next) => {
        const myWallet = new Wallets({
            user_id: ObjectID(),
            username: "tnk",
            wallets:
            {
                BTC: await BTCService.createWallet(),
                ETH: await ETHService.createWallet(),
            }

        });

        myWallet.save(err => {
            if (err)
                return res.status(500).send({ err })
            let user_id = ObjectID("60bd5f7dd2ddfd4dc011dca5");
            let balanceObj = [{
                user_id,
                currency: "BTC",
                amount: 0.00,
                type: "credit",
                details: {
                    receiver: myWallet.wallets.BTC.address,
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
                    receiver: myWallet.wallets.ETH.address,
                    sender: "core"
                },
                category: "Initial",
                data: {},
                wallet: "default",
            }
            ]
            balanceObj.map(obj => {
                new Producer(process.env.RABBIT_MQ).balanceQueue(obj);
            })
            return res.status(200).send({
                status: 200,
                message: "Wallet Created"
            })
        });
    }
    static getWalletByName = async (req, res, next) => {
        try {
            let user = "tnk"
            let name = req.params.name != null ? req.params.name : "default"
            console.log(name)
            let wallet = await Wallets.findOne(
                { "wallets.name": name, "username": user },
                {
                    "wallets.objects.BTC.privatekey": 0,
                    "wallets.objects.ETH.privatekey": 0
                });
            // console.log(wallet.wallets[0].name)
            if (!wallet)
                return res.status(400).send({
                    status: 404,
                    name: null,
                    wallet: null
                })

            return res.status(200).send({
                status: 200,
                name: wallet.wallets[0].name,
                wallet
            })


        } catch (error) {
            return res.status(500).send({
                status: 500,
                error
            })
        }
    }

    static updateNameWalletByName = async (req, res, next) => {
        try {
            let user = "tnk"
            let name = req.params.name
            let replace = req.params.replace
            let wallets = await Wallets.findOneAndUpdate(
                {
                    username: user,
                    name
                },
                { $set: { "name": replace } },
                //{ arrayFilters: [{ "elem.name": name }] }
            )
            res.status(200).send({
                status: 200,
                message: 'Wallet Name Updated'
            })
        } catch (error) {
            return res.status(500).send({
                status: 500,
                error
            })
        }
    }
}
module.exports = WalletController