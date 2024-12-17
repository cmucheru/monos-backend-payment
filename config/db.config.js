const { Sequelize } = require("sequelize");
require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const config = {
  development: {
    username: "postgres",
    password: "mucheru1234",
    database: "app_database",
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Only for self-signed certificates
      },
    },
  },
  test: {
    username: "test_user", // Use the new test user
    password: "test_password", // Set the correct password
    database: "test_app_database", // Use the new test database
    host: "localhost",
    dialect: "postgres",
    logging: false,
  },
};

const dbConfig = config[environment];

const sequelize =
  environment === "production"
    ? new Sequelize(process.env.DATABASE_URL, dbConfig)
    : environment === "test"
    ? new Sequelize(
        config.test.database,
        config.test.username,
        config.test.password,
        {
          host: config.test.host,
          dialect: config.test.dialect,
          logging: config.test.logging,
        }
      )
    : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
      });

module.exports = sequelize;
