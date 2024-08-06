const { DataSource } = require("typeorm");
require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/config.js")[env];

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.host,
  port: 5432,
  username: config.username,
  password: config.password,
  database: config.database,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/entities/*.entity.js"],
  migrations: [__dirname + "/migrations/*.entity.js"],
  cli: {
    entitiesDir: "entities",
    migrationsDir: "migrations",
  },
});

module.exports = AppDataSource;
