class WalletController {
    static createWallet = async (req, res, next) => {
        try {
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

            });
        } catch (err) {

        }
    }
}

module.exports = WalletController;