const fs = require('fs');
const crypto = require('crypto');
const {TIMESTAMP} = require('../config.js');

function hashFile(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        if (TIMESTAMP) {
            const timestamp = new Date().toISOString(); 
            hash.update(timestamp);
        }
        stream.on('data', function (data) {
            hash.update(data, 'utf8');
        });

        stream.on('end', function () {
            resolve(hash.digest('hex'));
        });

        stream.on('error', function (err) {
            reject(err);
        });
    });
}

const filePath = 'certificat.webp';

if (require.main === module) {
    hashFile(filePath)
        .then(hash => console.log('Hash du fichier:', hash))
        .catch(err => console.error('Erreur lors du hashage du fichier:', err));
}

module.exports = {hashFile};
