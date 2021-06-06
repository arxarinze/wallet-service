const axios = require('axios');

const CORE_ENGINE = process.env.CORE_ENGINE
class BTCService {
    static createWallet = async () => {
        try {
            let raw = await axios.get(CORE_ENGINE + '/api/address/BTC');
            return raw.data;
        } catch (error) {
            return error
        }
    }
}

module.exports = BTCService