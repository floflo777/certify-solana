# Certify Solana

[![CI](https://github.com/floflo777/certify-solana/actions/workflows/ci.yml/badge.svg)](https://github.com/floflo777/certify-solana/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight tool to certify text or files on the Solana blockchain using the Memo program. Creates an immutable, timestamped proof of existence for any content by recording its SHA-256 hash on-chain.

## Use Cases

- **Document certification**: Prove a document existed at a specific point in time
- **Intellectual property**: Timestamp creative works, code, or inventions
- **Audit trails**: Create verifiable records for compliance purposes
- **Data integrity**: Verify files haven't been modified since certification

## How It Works

1. The tool computes a SHA-256 hash of your text or file
2. Optionally prepends a timestamp to ensure uniqueness
3. Records the hash on Solana's blockchain via the [Memo program](https://spl.solana.com/memo)
4. Returns a transaction signature as proof of certification

The resulting transaction is permanent and publicly verifiable on any Solana explorer.

## Requirements

- Node.js >= 20.0.0
- A Solana wallet with a small amount of SOL (< 0.001 SOL per transaction)

## Installation

```bash
git clone git@github.com:floflo777/certify-solana.git
cd certify-solana
npm install
cp .env.template .env
```

## Configuration

### Environment Variables

Add your Solana private key to `.env`:

```
PRIVATE_KEY=your_private_key_here
```

Supported formats:
- Base58 encoded string
- JSON array of bytes (`[1,2,3,...]`)
- Mnemonic phrase (BIP39)

### Settings

Edit `config.json` to configure the certification mode:

```json
{
  "hashType": {
    "text": true,
    "file": false
  },
  "path": "document.pdf",
  "timestamp": true
}
```

| Parameter | Description |
|-----------|-------------|
| `hashType.text` | Set to `true` to certify text (hardcoded in `src/certif.js`) |
| `hashType.file` | Set to `true` to certify a file |
| `path` | Path to the file to certify (when `hashType.file` is `true`) |
| `timestamp` | Prepend ISO timestamp to ensure unique hashes for identical content |

## Usage

```bash
node src/certif.js
```

Output:
```
Transaction ABC123... confirmed
Hash of file document.pdf has been recorded on Solana's blockchain.
```

## Verifying a Certification

1. Note the transaction signature from the output
2. Visit [Solana Explorer](https://explorer.solana.com/)
3. Search for the transaction signature
4. The memo field contains your SHA-256 hash

To verify a document, compute its hash with the same parameters and compare it to the on-chain record.

## Architecture

```
certify-solana/
├── src/
│   ├── certif.js      # Main certification logic
│   └── hashFile.js    # File hashing utility
├── config.js          # Configuration loader
├── config.json        # User settings
└── .env               # Private key (not committed)
```

## License

MIT
