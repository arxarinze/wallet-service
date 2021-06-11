const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const AccountController = require('./src/controllers/account.controller')
const app = express();
const port = process.env.PORT || 5000;
const base = 'api'
const version = 'v1'
const Web3 = require('web3');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
    }, () => {
        console.log('MongoDB Connected')
    })
app.post(`/${base}/${version}/`, (req, res) => {
    // var web3 = new Web3("http://3.8.39.172:8545");
    // let pk = web3.eth.accounts.privateKeyToAccount("0x9f3a601719d674fc146d5456bf84fc465d35e56303eeb5efeb1e70384ecb9958")
    // console.log(pk)
    res.send("<h1>Hello, aren't we the best at what we do?</h1>")
})
//app.get(`/${base}/${version}/wallet/:name`, WalletController.getWalletByName)
//app.put(`/${base}/${version}/wallet/:name/:replace`, WalletController.updateNameWalletByName)
app.post(`/${base}/${version}/account`, AccountController.createAccount)
