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
        PORT: 5001,
        MONGO_URI: "mongodb+srv://thakurniks23943_db_user:LuJEaY8VacpSjYRO@cluster0.w8t8e45.mongodb.net/?appName=Cluster0"
      }
    }
  ]
};