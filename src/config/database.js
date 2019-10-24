require('dotenv/config');

module.exports = {
  dialect: process.env.DB_DRIVER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
