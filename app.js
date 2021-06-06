const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const WalletController = require('./src/controllers/wallet.controller')
const app = express();
const port = process.env.PORT || 5000;
const base = 'api'
const version = 'v1'
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('MongoDB Connected')
    })
app.post(`/${base}/${version}/`, (req, res) => {
    res.send("<h1>Hello, aren't we the best at what we do?</h1>")
})
app.get(`/${base}/${version}/wallet`, (req, res) => {
    Wallets.findOne({
        "username": "tnk"
    }, (err, wallet) => {
        if (err) return next(err);
        res.status(200).json(wallet);
    });
})
app.post(`/${base}/${version}/wallet`, WalletController.createWallet)
