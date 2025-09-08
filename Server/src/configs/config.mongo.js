
require("dotenv").config();
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        user: process.env.DEV_DB_USER || "mongo",
        password: process.env.DEV_DB_PASSWORD || "root123456",
        name: process.env.DEV_DB_NAME || "EcommerceWeb",
        url: process.env.DEV_DB_URL || "interncluster.2c8iyqg.mongodb.net"
    }
};

const config  = {dev}
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env]