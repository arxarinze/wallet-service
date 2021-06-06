let BTCService = require('../services/btc.service');
const Wallets = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
class WalletController {
    static createWallet = async (req, res) => {
        let body = req.body;
        const myWallet = new Wallets({
            user_id: ObjectID(),
            username: body.username,
            wallets: [
                {
                    name: body.name,
                    objects: {
                        BTC: await BTCService.createWallet('BTC'),

                    }
                }
            ]
        });
        myWallet.save(err => {
            if (err)
                return next(err);
            res.status(200).send({
                status: 200,
                message: "Wallet Created"
            })
        });
    }
}
module.exports = WalletController