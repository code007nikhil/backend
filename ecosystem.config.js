module.exports = {
  apps: [
    {
      name: "transport-management",
      script: "src/server.js",
      cwd: "/root/backend",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        CLIENT_URL: process.env.CLIENT_URL
      }
    }
  ]
};