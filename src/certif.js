const web3 = require('@solana/web3.js');
const crypto = require('crypto');
require('dotenv').config();
const bs58 = require('bs58');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const {hashFile} = require('./hashFile');
const {HASH_TYPE, PATH, TIMESTAMP} = require('../config.js');

async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');
    let payer;
    if (process.env.PRIVATE_KEY.startsWith('[')) {
        const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
        payer = web3.Keypair.fromSecretKey(secretKey);
    } else if (process.env.PRIVATE_KEY.split(' ').length > 1) {
        const seed = await bip39.mnemonicToSeed(process.env.PRIVATE_KEY);
        const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
        payer = web3.Keypair.fromSeed(derivedSeed.slice(0, 32));
    } else {
        const secretKey = bs58.decode(process.env.PRIVATE_KEY);
        payer = web3.Keypair.fromSecretKey(secretKey);
    }

    let hash;
    let text;
    if (HASH_TYPE.text) {
        text = "Hello world !";
        const timestamp = new Date().toISOString();
        const dataToHash = timestamp + text;
        if (TIMESTAMP) {
            hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
        } else {
            hash = crypto.createHash('sha256').update(text).digest('hex');
        }
    } 
    if (HASH_TYPE.file) {
        const filePath = PATH;
        hash = await hashFile(filePath);
    }

    const memoInstruction = new web3.TransactionInstruction({
        keys: [],
        programId: new web3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(hash),
    });
    //console.log(memoInstruction);

    const transaction = new web3.Transaction().add(memoInstruction);
    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

    console.log(`Transaction ${signature} confirmed`);
    if (HASH_TYPE.text) {
        console.log(`Hashed text '${text}' has been recorded on Solana's blockchain.`);
    } else {
        console.log(`Hash of file ${PATH} has been recorded on Solana's blockchain.`);
    }
}

main().catch(err => console.error(err));
