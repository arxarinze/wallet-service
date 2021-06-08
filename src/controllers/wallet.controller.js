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
        let name = req.params.id
        let wallet = Wallets.findOne({ "wallets.0.name": name });
        return res.status(200).send({
            status: 200,
            name,
            wallet
        })
    }
}
module.exports = WalletController