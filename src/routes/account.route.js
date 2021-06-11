const express = require("express");
const AccountController = require('../controllers/account.controller')

var router = express.Router();

router.post(`/`, AccountController.createAccount)

module.exports = router