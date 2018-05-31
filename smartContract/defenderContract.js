"use strict";

// let Stubs = require("./contractStubs.js");
// let LocalContractStorage = Stubs.LocalContractStorage;
// let Blockchain = Stubs.Blockchain;
// let BigNumber = require("bignumber.js");

class Transaction {
    constructor(text) {
        let obj = text ? JSON.parse(text) : {};
        this.id = obj.id || 0;
        this.date = obj.date;
        this.from = obj.from;
        this.to = obj.to;
        this.amount = obj.amount;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Profile {
    constructor(text) {
        let obj = text ? JSON.parse(text) : {};
        this.wallet = obj.wallet;
        this.balance = obj.balance || 0;
        this.passphraseHash = obj.passphraseHash;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class DefenderContract {
    constructor() {
        LocalContractStorage.defineProperty(this, "transactionCount");
        LocalContractStorage.defineMapProperty(this, "profileTransactions");
        LocalContractStorage.defineMapProperty(this, "profiles", {
            parse: function (text) {
                return new Profile(text);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
        LocalContractStorage.defineMapProperty(this, "transactions", {
            parse: function (text) {
                return new Transaction(text);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
    }

    init() {
        this.transactionCount = 1;
    }

    setOrChangePasshraseHash(oldHash, newHash) {
        let wallet = Blockchain.transaction.from;

        let existsProfile = this.profiles.get(wallet);
        if (existsProfile && existsProfile.passphraseHash != oldHash) {
            throw new Error("Wrong passphrase");
        }

        existsProfile = existsProfile || new Profile();
        existsProfile.wallet = wallet;
        existsProfile.passphraseHash = newHash;
        this.profiles.put(wallet, existsProfile);
    }

    deposit() {
        let wallet = Blockchain.transaction.from;
        let amount = Blockchain.transaction.value;

        let profile = this.profiles.get(wallet);
        if (!profile) {
            throw new Error("You must first set a passphrase");
        }

        profile.balance = new BigNumber(profile.balance).plus(amount);
        this.profiles.put(wallet, profile);
    }

    getBalance() {
        let wallet = Blockchain.transaction.from;
        let profile = this.profiles.get(wallet);

        if (!profile) {
            throw new Error("Profile not found");
        }

        return profile.balance;
    }

    send(amount, to, passphraseHash) {
        let from = Blockchain.transaction.from;

        let result = Blockchain.verifyAddress(to);
        if (!result) {
            throw new Error(`"${to}" is not valid adress`);
        }

        let profile = this.profiles.get(from);
        if (!profile) {
            throw new Error("You must first set a passphrase");
        }

        if (profile.passphraseHash != passphraseHash) {
            throw new Error("Wrong passphrase");
        }

        if (profile.balance < amount) {
            throw new Error("Insufficient funds on the your balance");
        }

        let id = new BigNumber(this.transactionCount).toNumber();
        let transaction = new Transaction();
        transaction.id = id;
        transaction.date = Date.now();
        transaction.from = from;
        transaction.to = to;
        transaction.amount = amount;

        result = Blockchain.transfer(to, amount);
        if (!result) {
            throw new Error("Transaction failed");
        }

        profile.balance = new BigNumber(profile.balance).minus(amount).toNumber();
        this.profiles.put(from, profile);

        this.transactions.put(id, transaction);

        let profileTransactions = this.profileTransactions.get(from) || [];
        profileTransactions.push(id);
        this.profileTransactions.put(from, profileTransactions);

        this.transactionCount = new BigNumber(this.transactionCount).plus(1).toNumber();
    }

    getTransactions() {
        let wallet = Blockchain.transaction.from;
        let profileTransactionIds = this.profileTransactions.get(wallet) || [];

        let arr = [];
        for (const transactionId of profileTransactionIds) {
            let transaction = this.transactions.get(transactionId);
            if (transaction) {
                arr.push(transaction);
            }
        }

        return arr;
    }
}

module.exports = DefenderContract;