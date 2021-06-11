const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema({
    user_id: { type: String, required: true, id: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    wallet: { type: String, required: true, id: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
module.exports = mongoose.model("wallet-transactions", WalletTransactionSchema);