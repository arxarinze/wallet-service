const Wallet = require("../models/wallet.model");
const { ObjectID } = require('mongodb');
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
                return res.status(200).send({ status: 200, message: `Your wallet #${body.name} has been created!` })
            });
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = WalletController;