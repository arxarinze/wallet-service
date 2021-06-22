const express = require("express");
const WalletController = require('../controllers/wallet.controller')

var router = express.Router();

router.post(`/`, WalletController.createWallet);
router.get('/:name', WalletController.getWallet);
router.post('/move', WalletController.moveFundsFromWallet);

module.exports = router