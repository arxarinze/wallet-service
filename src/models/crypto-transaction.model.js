const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CryptoTransactionSchema = new Schema({
    user_id: { type: String, required: true, id: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    details: {
        sender: String,
        receiver: String
    },
    data: { type: Object },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
module.exports = mongoose.model("crypto-transactions", CryptoTransactionSchema);