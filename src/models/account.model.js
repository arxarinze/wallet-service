const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    user_id: { type: String, required: true, index: true, id: true, unique: true, dropDups: true },
    account:
    {
        _id: false,

        BTC: { type: Object },
        ETH: { type: Object },
        BNB: { type: Object },

    },
    createdAt: { date: { type: Date, default: Date.now() } },
    createdAt: { date: { type: Date, default: Date.now() } }
});
module.exports = mongoose.model("accounts", AccountSchema);