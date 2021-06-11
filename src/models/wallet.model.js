const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    user_id: { type: String, required: true, id: true },
    username: { type: String, required: true },
    wallets:
    {
        _id: false,

        BTC: { type: Object },
        ETH: { type: Object },
        BNB: { type: Object },

    },
    createdAt: { type: Date, default: Date.now() }

});
module.exports = mongoose.model("wallets", WalletSchema);