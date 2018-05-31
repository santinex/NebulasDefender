const CONTRACT_ADDRESS = "n1mMbCKgdMa1UV1cyjjujkS9GxpV5LNeDcy"; //1e69a1115b427853c9e0f207a8e68d21804be4053b5e2f7ce4b5185014a24425

class SmartContractApi {
    constructor(contractAdress) {
        let NebPay = require("nebpay");
        this.nebPay = new NebPay();
        this._contractAdress = contractAdress || CONTRACT_ADDRESS;
    }

    getContractAddress() {
        return this.contractAdress;
    }

    _simulateCall({ value = "0", callArgs = "[]", callFunction, callback }) {
        this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }

    _call({ value = "0", callArgs = "[]", callFunction, callback }) {
        this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }
}

class DefenderContract extends SmartContractApi {
    setOrChangePasshraseHash(oldHash, newHash, cb) {
        this._call({
            callArgs: `["${oldHash}", "${newHash}"]`,
            callFunction: "setOrChangePasshraseHash",
            callback: cb
        });
    }

    deposit(cb) {
        this._call({
            callFunction: "deposit",
            callback: cb
        });
    }

    send(amount, to, passphraseHash, cb) {
        this._call({
            callArgs: `[${amount}, "${to}", "${passphraseHash}"]`,
            callFunction: "send",
            callback: cb
        });
    }

    getBalance(cb) {
        this._simulateCall({
            callFunction: "getBalance",
            callback: cb
        });;
    }

    getTransactions(cb) {
        this._simulateCall({
            callFunction: "getTransactions",
            callback: cb
        });;
    }

}
