var assert = require("assert")
let Stubs = require("../contractStubs.js");
let Contract = require("../defenderContract.js");

var Blockchain = Stubs.Blockchain;
var LocalContractStorage = Stubs.LocalContractStorage;

let contract = new Contract();
contract.init();
console.clear();

describe('SmartContract', () => {
    describe('Total', () => {
        contract.setOrChangePasshraseHash("", "qqq");
        contract.deposit();
        contract.deposit();

        let balance = contract.getBalance();
        contract.send(Blockchain.transaction.from, "qqq");

        it('contract tests', () => {
            assert(balance > 0);
        });
    });

});