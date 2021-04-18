const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password:"everylessonlearned",
    host: "localhost",
    port: 5000,
    database: "foodfy"
})