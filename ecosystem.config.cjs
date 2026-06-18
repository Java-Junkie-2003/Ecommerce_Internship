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
      },
    },
    {
      name: "ecommerce-client-dev",
      cwd: "./Client",
      script: "node_modules/@react-router/serve/bin.js",
      args: "./build/server/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_API_URL: "/api",
      },
    },
  ],
};
