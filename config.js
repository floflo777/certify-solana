const config = require('./config.json');
HASH_TYPE=config.hashType;
PATH=config.path;
TIMESTAMP=config.timestamp;

module.exports= {
    HASH_TYPE,
    PATH,
    TIMESTAMP
};