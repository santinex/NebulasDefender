# Nebulas Defender

The service keeps your funds on the balance of the smart contract and provides an additional level of protection of your tokens with a passphrase. Therefore, to make a transaction, you need to have access to your wallet and know the passphrase. This means that if your private key has been compromised, the attacker will not be able to use your funds if he does not know the passphrase.

### Smart Contract

- `setOrChangePasshraseHash(oldHash, newHash)` - Sets or changes the hash of the passphrase.

- `deposit()` - Performs replenishment of the balance.

- `getBalance()` - Returns the user's balance.

- `send(amount, to, passphraseHash)` - Performs a transaction.

- `getTransactions()` - Returns the user's transactions.