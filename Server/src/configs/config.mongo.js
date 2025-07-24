const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        user: process.env.DEV_DB_USER || "mongo",
        password: process.env.DEV_DB_PASSWORD || "123456",
        name: process.env.DEV_DB_NAME || "EcommerceWeb"
    }
};

const config  = {dev}
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env]