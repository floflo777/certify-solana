## Installation :

```bash
git clone git@github.com:floflo777/certify-solana.git
npm install
cp .env.template .env
```

Then, configure the settings in config.json and enter your private-key in the .env file. If you want to guarantee the uniqueness of your file, set the timestamp parameter to true. If you encounter errors using node js, try using node@20.0.0.

## Certify your text or files :

```bash
node src/certif.js
```