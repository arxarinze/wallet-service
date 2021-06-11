const express = require("express");
const WalletController = require('../controllers/wallet.controller')

var router = express.Router();

router.post(`/`, WalletController.createWallet)

module.exports = router