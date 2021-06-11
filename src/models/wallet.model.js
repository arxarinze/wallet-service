const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    _id: {
        user_id: { type: String, required: true, id: true },
        wallet: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
module.exports = mongoose.model("wallets", WalletSchema);