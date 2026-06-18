module.exports = {
  apps: [
    {
      name: "ecommerce-server-dev",
      cwd: "./Server",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "dev",
        DEV_APP_PORT: 3055,
        DEV_DB_USER=vnraizo,
        DEV_DB_PASSWORD=daMblOpBhbu1IsSF,
        DEV_DB_NAME=EcommerceDB,
      },
    }
  ]
};
