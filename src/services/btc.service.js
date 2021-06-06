const axios = require('axios');

const CORE_ENGINE = process.env.CORE_ENGINE
class BTCService {
    static createWallet = async (currency) => {
        if (currency == "BTC") {
            let raw = await axios.get(CORE_ENGINE + '/api/address/' + currency);
            return raw.data;
        }
    }
}

module.exports = BTCService