let BTCService = require('../services/btc.service');
let ETHService = require('../services/eth.service');
const Wallets = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
class WalletController {
    static createWallet = async (req, res, next) => {
        let body = req.body;
        const myWallet = new Wallets({
            user_id: ObjectID(),
            username: body.username,
            wallets: [
                {
                    name: body.name,
                    objects: {
                        BTC: await BTCService.createWallet(),
                        ETH: await ETHService.createWallet(),
                    }
                }
            ]
        });
        myWallet.save(err => {
            if (err)
                return res.status(500).send({ err })
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
                },
                { $set: { "wallets.$[elem].name": replace } },
                { arrayFilters: [{ "elem.name": name }] }
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